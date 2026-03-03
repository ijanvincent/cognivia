import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance } from 'react-native';

const lightTheme = {
    primary: '#007AFF',      // Blue (Main interactive color)
    secondary: '#FF9500',    // Orange (Accent color)
    background: '#F5F5F5',   // Light gray background
    card: '#FFFFFF',         // White card/container
    text: '#333333',         // Dark text
    subtext: '#666666',      // Gray subtext
    border: '#E0E0E0',        // Light border
    status: '#4CAF50',       // Success/Mastery color
    logout: '#FF3B30',       // Red for danger/logout
};


const darkTheme = {
    primary: '#FFFFFF',      // White (Used for main interactive elements/icons)
    secondary: '#BBBBBB',    // Light Gray for accents
    background: '#000000',   // Pure Black background
    card: '#1E1E1E',         // Very Dark Gray card/container
    text: '#FFFFFF',         // White text
    subtext: '#AAAAAA',      // Gray subtext
    border: '#333333',        // Darker border
    status: '#FFFFFF',       // White for status/mastery indicator
    logout: '#FF3B30',       // Red is often kept for universal warning/danger colors
};


const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    
    const colorScheme = Appearance.getColorScheme();
    const initialMode = colorScheme === 'dark' ? 'dark' : 'light';

    const [theme, setTheme] = useState(initialMode);
    
    
    const currentColors = theme === 'light' ? lightTheme : darkTheme;

    
    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            
            setTheme(colorScheme === 'dark' ? 'dark' : 'light');
        });
        return () => subscription.remove();
    }, []);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, colors: currentColors, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);