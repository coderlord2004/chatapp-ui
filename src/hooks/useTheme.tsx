'use client';

import {
	createContext,
	type PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from 'react';

type Theme = 'dark' | 'light';

export const ThemeContext = createContext({
	theme: 'dark',
	toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

function ThemeProvider({ children }: PropsWithChildren) {
	const { theme } = useTheme();
	const className = theme === 'dark' ? theme : '';
	return <div className={className}>{children}</div>;
}

export const ThemeContextProvider = ({ children }: PropsWithChildren) => {
	const [theme, setTheme] = useState<Theme>('dark');

	useEffect(() => {
		const storedTheme = localStorage.getItem('theme') as Theme;
		if (storedTheme !== null) {
			setTheme(storedTheme);
		}
	}, []);

	const toggleTheme = () => {
		localStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark');
		setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			<ThemeProvider>{children}</ThemeProvider>
		</ThemeContext.Provider>
	);
};
