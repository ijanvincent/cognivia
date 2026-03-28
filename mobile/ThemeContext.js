import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance } from 'react-native';

const lightTheme = {
    primary: '#007AFF',      
    secondary: '#FF9500',    
    background: '#F5F5F5',   
    card: '#FFFFFF',         
    text: '#333333',         
    subtext: '#666666',      
    border: '#E0E0E0',        
    status: '#4CAF50',      
    logout: '#FF3B30',       
};


const darkTheme = {
    primary: '#FFFFFF',      
    secondary: '#BBBBBB',    
    background: '#000000',   
    card: '#1E1E1E',         
    text: '#FFFFFF',        
    subtext: '#AAAAAA',     
    border: '#333333',       
    status: '#FFFFFF',       
    logout: '#FF3B30',      
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