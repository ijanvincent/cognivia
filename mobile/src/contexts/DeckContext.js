import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';     
import api from '../services/api';

export const DeckContext = createContext({
    decks: [],
    addDeck: () => {},
    removeDeck: () => {},
    refreshDecks: () => {},
    loading: false,
});

export const DeckProvider = ({ children }) => {
    const [decks, setDecks]             = useState([]);
    const [loading, setLoading]         = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userStr = await SecureStore.getItemAsync('user'); 
                if (userStr) {
                    setCurrentUser(JSON.parse(userStr));
                }
            } catch (e) {
                console.error('Error loading user:', e);
            }
        };
        loadUser();
    }, []);

    const fetchDecks = useCallback(async ({ silent = false } = {}) => {
        try {
            if (!silent) setLoading(true);
            const response = await api.get('/decks');
            setDecks(response.data.decks || []);
        } catch (error) {
            console.error('Error fetching decks:', error);
            if (!silent) setDecks([]);
        } finally {
            if (!silent) setLoading(false);
        }
    }, []);


    useEffect(() => {
        if (!currentUser) {
            setDecks([]);
            setLoading(false);
            return;
        }
        fetchDecks();
    }, [currentUser, fetchDecks]);

    const addDeck = async (newDeckData) => {
        try {
            const response = await api.post('/decks', {
                title:      newDeckData.deckName,
                source:     newDeckData.fileName,
                card_count: parseInt(newDeckData.numberOfCards),
                mastery:    0,
                progress:   0,
                status:     newDeckData.status || 'New',
            });
            const newDeck = response.data.deck;
            setDecks(prev => [newDeck, ...prev]);
            return newDeck;
        } catch (error) {
            console.error('Error adding deck:', error);
            throw error;
        }
    };

    const removeDeck = async (deckId) => {
        try {
            await api.delete(`/decks/${deckId}`);
            setDecks(prev => prev.filter(d => d.id !== deckId));
        } catch (error) {
            console.error('Error removing deck:', error);
            throw error;
        }
    };

    return (
        <DeckContext.Provider value={{ decks, addDeck, removeDeck, loading, refreshDecks: fetchDecks }}>
            {children}
        </DeckContext.Provider>
    );
};

export const useDecks = () => useContext(DeckContext);
