import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    TextInput, 
    Switch, 
    Alert,
    ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { useDecks } from '../DeckContext';
import { useTheme } from '../ThemeContext';
import { generateFlashcardsWithGemini} from '../geminiService';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const GenerateScreen = () => {
    const { colors, theme } = useTheme();
    const [deckName, setDeckName] = useState('');
    const [simpleDefinition, setSimpleDefinition] = useState(false);
    const [numberOfCards, setNumberOfCards] = useState(35);
    const [selectedFileName, setSelectedFileName] = useState('No file selected');
    const [selectedFileUri, setSelectedFileUri] = useState(null);
    const [fileContent, setFileContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    
    const navigation = useNavigation();
    const { addDeck } = useDecks();

    const handleSelectFile = async () => {
        if (isLoading) return;

        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['text/plain'], // Only allow .txt files for now
                copyToCacheDirectory: true,
            });

            if (result.canceled === false) {
                const file = result.assets[0];
                const fileName = file.name;
                const fileUri = file.uri;
                
                setSelectedFileName(fileName);
                setSelectedFileUri(fileUri);
                
                const baseName = fileName.replace(/\.[^/.]+$/, "");
                setDeckName(baseName);

                // Try to read file content
                setLoadingMessage('Reading file...');
                setIsLoading(true);

                try {
                    // For .txt files, we can read directly
                    if (fileName.endsWith('.txt')) {
                        const content = await FileSystem.readAsStringAsync(fileUri);
                        setFileContent(content);
                        Alert.alert("File Selected", `Ready to generate flashcards from ${fileName}`);
                    } else if (fileName.endsWith('.pdf') || fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
                        // For PDF/DOCX, show a message
                        Alert.alert(
                            "PDF/DOCX Not Fully Supported", 
                            `${fileName} selected, but PDF/DOCX text extraction is not yet available.\n\n📝 Please convert your file to .txt format first:\n\n• For PDF: Use an online converter like pdf2txt.com\n• For DOCX: Open in Word/Google Docs and "Save As" → Plain Text (.txt)\n\nThen select the .txt file to generate flashcards.`,
                            [
                                { text: "Cancel", onPress: () => {
                                    setSelectedFileName('No file selected');
                                    setSelectedFileUri(null);
                                    setFileContent('');
                                }},
                                { text: "Continue Anyway", onPress: () => {
                                    setFileContent(`Unable to extract text from ${fileName}. Please use a .txt file instead.`);
                                }}
                            ]
                        );
                        return;
                    }
                } catch (readError) {
                    console.error('Error reading file:', readError);
                    Alert.alert(
                        "File Selected",
                        `${fileName} selected. The file will be processed during generation.`
                    );
                    setFileContent(`[Document: ${fileName}]`);
                } finally {
                    setIsLoading(false);
                    setLoadingMessage('');
                }
            }
        } catch (err) {
            Alert.alert("Error", "Could not select file. Please try again.");
            console.error('Document Picker Error:', err);
            setIsLoading(false);
        }
    };

    const handleGenerateFlashcards = async () => {
        if (!deckName || selectedFileName === 'No file selected') {
            Alert.alert("Error", "Please select a file and enter a deck name.");
            return;
        }

        if (!fileContent || fileContent.length < 100) {
            Alert.alert(
                "Limited Content",
                "The file appears to have very little text content. For PDF/DOCX files, consider converting to .txt for better results. Continue anyway?",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Continue", onPress: () => proceedWithGeneration() }
                ]
            );
            return;
        }

        await proceedWithGeneration();
    };

    const proceedWithGeneration = async () => {
        setIsLoading(true);
        setLoadingMessage('AI is analyzing your document...');

        try {
            // Generate flashcards using Gemini AI
            setLoadingMessage('Generating flashcards with AI...');
            
            const flashcards = await generateFlashcardsWithGemini(
                fileContent,
                numberOfCards,
                simpleDefinition
            );

            if (!flashcards || flashcards.length === 0) {
                throw new Error('No flashcards were generated');
            }

            setLoadingMessage('Saving to database...');

            // Create deck in Firestore
            const deckData = {
                userId: auth.currentUser.uid,
                title: deckName,
                source: selectedFileName,
                cardCount: flashcards.length,
                mastery: 0,
                progress: 0,
                status: 'New',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const deckRef = await addDoc(collection(db, 'decks'), deckData);

            // Save flashcards to Firestore
            const flashcardsPromises = flashcards.map(card =>
                addDoc(collection(db, 'flashcards'), {
                    deckId: deckRef.id,
                    userId: auth.currentUser.uid,
                    question: card.question,
                    answer: card.answer,
                    mastered: false,
                    reviewCount: 0,
                    createdAt: new Date().toISOString(),
                })
            );

            await Promise.all(flashcardsPromises);

            // Don't add to local context - Firestore listener will handle it automatically
            // The DeckContext is already listening to Firestore changes

            Alert.alert(
                "Success!", 
                `Generated ${flashcards.length} flashcards for "${deckName}"`,
                [{ text: "OK", onPress: () => navigation.navigate('Home') }]
            );

            // Reset form
            setDeckName('');
            setSelectedFileName('No file selected');
            setSelectedFileUri(null);
            setFileContent('');
            setNumberOfCards(35);

        } catch (error) {
            console.error("Generation Error:", error);
            
            let errorMessage = "An error occurred while generating flashcards.";
            
            if (error.message.includes('API key')) {
                errorMessage = "Invalid API key. Please check your Gemini API configuration.";
            } else if (error.message.includes('quota')) {
                errorMessage = "API quota exceeded. Please try again later or check your API limits.";
            } else if (error.message.includes('network')) {
                errorMessage = "Network error. Please check your internet connection.";
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Alert.alert("Generation Failed", errorMessage);
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <View style={[styles.loadingBox, { backgroundColor: colors.card }]}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={[styles.loadingText, { color: colors.text }]}>
                            {loadingMessage}
                        </Text>
                    </View>
                </View>
            )}

            <TouchableOpacity 
                style={[
                    styles.selectFileButton, 
                    { backgroundColor: colors.primary }, 
                    isLoading && styles.selectFileButtonDisabled 
                ]} 
                onPress={handleSelectFile}
                disabled={isLoading}
            >
                <MaterialCommunityIcons name="cloud-upload-outline" size={24} color="black" />
                <Text style={styles.selectFileButtonText}>Select TXT File</Text>
            </TouchableOpacity>

            <Text style={[styles.label, { color: colors.text }]}>Deck Name</Text>
            <TextInput
                style={[
                    styles.textInput, 
                    { 
                        backgroundColor: colors.card, 
                        borderColor: colors.border,
                        color: colors.text
                    }
                ]}
                value={deckName}
                onChangeText={setDeckName}
                placeholder="Enter deck name"
                placeholderTextColor={colors.subtext}
                editable={!isLoading}
            />

            <Text style={[styles.generatedFromFileText, { color: colors.subtext }]}>
                {selectedFileName === 'No file selected' 
                    ? 'No file selected yet'
                    : `Generate from "${selectedFileName}"`
                }
            </Text>

            <View style={[
                styles.optionRow, 
                { 
                    backgroundColor: colors.card, 
                    borderColor: colors.border 
                }
            ]}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>Simple Definition</Text>
                <Switch
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={theme === 'dark' ? colors.card : '#f4f3f4'}
                    onValueChange={setSimpleDefinition}
                    value={simpleDefinition}
                    disabled={isLoading}
                />
            </View>

            <Text style={[styles.label, { color: colors.text }]}>
                Number of Cards ({Math.round(numberOfCards)} / 60)
            </Text>
            <Slider
                style={styles.slider}
                minimumValue={10}
                maximumValue={60}
                step={1}
                value={numberOfCards}
                onValueChange={setNumberOfCards}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.border}
                thumbTintColor={colors.primary}
                disabled={isLoading}
            />
            <Text style={[styles.sliderValueText, { color: colors.text }]}>
                {Math.round(numberOfCards)}
            </Text>

            <TouchableOpacity 
                style={[
                    styles.generateButton, 
                    { backgroundColor: colors.primary }, 
                    (isLoading || selectedFileName === 'No file selected') && styles.generateButtonDisabled
                ]} 
                onPress={handleGenerateFlashcards}
                disabled={isLoading || selectedFileName === 'No file selected'}
            >
                <Text style={styles.generateButtonText}>
                    {isLoading ? 'Generating...' : 'Generate Flashcards with AI'}
                </Text>
            </TouchableOpacity>

            <Text style={[styles.footerNote, { color: colors.subtext }]}>
                ⚡ Powered by Google Gemini AI
            </Text>

            <View style={styles.banner}>
      <Text style={styles.title}>⚠️ System Notice</Text>
      <Text style={styles.message}>
        PDF and Word files are not supported for flashcard generation and will result in an error.
      </Text>
      <Text style={styles.message}>
        Please convert your PDF or Word file into a plain .txt file using WPS or another file editor.
      </Text>
      <Text style={styles.message}>
        Renaming the file in your File Manager is not recommended, as it may corrupt the file and alter its content.
      </Text>
    </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 40,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingBox: {
        padding: 30,
        borderRadius: 15,
        alignItems: 'center',
        minWidth: 200,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        textAlign: 'center',
    },
    selectFileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        marginTop: 20,
    },
    selectFileButtonDisabled: {
        opacity: 0.5,
    },
    selectFileButtonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    generatedFromFileText: {
        fontSize: 14,
        textAlign: 'left',
        marginBottom: 25,
        fontStyle: 'italic',
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    slider: {
        width: '100%',
        height: 40,
        marginTop: 10,
        marginBottom: 5,
    },
    sliderValueText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
    },
    generateButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    generateButtonDisabled: {
        opacity: 0.5,
    },
    generateButtonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: '600',
    },
    footerNote: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 15,
        fontStyle: 'italic',
    },
     banner: {
    backgroundColor: '#fff3cd', // soft warning yellow
    borderColor: '#ffeeba',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    margin: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#856404',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 4,
  },
});

export default GenerateScreen;