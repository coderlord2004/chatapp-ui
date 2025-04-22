"use client"

import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

type Theme = 'dark' | 'light'

export const ThemeContext = createContext({
    theme: 'dark',
    toggleTheme: () => { }
});

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>('dark');

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'light' || storedTheme === 'dark') {
            setTheme(storedTheme);
        }
    }, []);

    const toggleTheme = () => {
        localStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark')
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)