import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance } from 'react-native';
import { lightTheme, darkTheme } from '../theme/theme';

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