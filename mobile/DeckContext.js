import React, { createContext, useState, useContext, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebaseConfig';

export const DeckContext = createContext({
    decks: [],
    addDeck: () => {},
    removeDeck: () => {},
    loading: false,
});

export const DeckProvider = ({ children }) => {
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    // Listen to authentication state changes
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (!user) {
                // User logged out - clear decks immediately
                setDecks([]);
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    // Listen to real-time updates from Firestore
    useEffect(() => {
        // Only set up listener if user is authenticated
        if (!currentUser) {
            setDecks([]);
            setLoading(false);
            return;
        }

        const decksRef = collection(db, 'decks');
        const q = query(
            decksRef, 
            where('userId', '==', currentUser.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const decksList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setDecks(decksList);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching decks:', error);
            if (error.code === 'permission-denied') {
                setDecks([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]); // Re-run when currentUser changes

    const addDeck = async (newDeckData) => {
        try {
            if (!currentUser) {
                throw new Error('User not authenticated');
            }

            const newDeck = {
                userId: currentUser.uid,
                title: newDeckData.deckName,
                source: newDeckData.fileName,
                cardCount: parseInt(newDeckData.numberOfCards),
                mastery: 0,
                progress: 0,
                status: newDeckData.status || 'New',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const docRef = await addDoc(collection(db, 'decks'), newDeck);
            
            return {
                id: docRef.id,
                ...newDeck
            };
        } catch (error) {
            console.error('Error adding deck:', error);
            throw error;
        }
    };
    
    const removeDeck = async (deckId) => {
        try {
            await deleteDoc(doc(db, 'decks', deckId));
        } catch (error) {
            console.error('Error removing deck:', error);
            throw error;
        }
    };

    return (
        <DeckContext.Provider value={{ decks, addDeck, removeDeck, loading }}>
            {children}
        </DeckContext.Provider>
    );
};

export const useDecks = () => {
    return useContext(DeckContext);
};