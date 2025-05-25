'use client';

import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { decodeJwt } from 'jose';
import { WebSocketContextProvider } from '@/hooks/useWebSocket';

type AuthContextType = {
	accessToken: string | null;
	refreshToken: string | null;
	login: (accessToken: string, refreshToken: string) => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [refreshToken, setRefreshToken] = useState<string | null>(null);

	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const storedAccessToken = localStorage.getItem('accessToken');
		const storedRefreshToken = localStorage.getItem('refreshToken');
		if (storedAccessToken) {
			setAccessToken(storedAccessToken);
		}
		if (storedRefreshToken) {
			setRefreshToken(storedRefreshToken);
		}
	}, []);

	const login = (access: string, refresh: string) => {
		localStorage.setItem('accessToken', access);
		localStorage.setItem('refreshToken', refresh);
		setAccessToken(access);
		setRefreshToken(refresh);
	};

	const logout = () => {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		setAccessToken(null);
		setRefreshToken(null);
	};

	useEffect(() => {
		if (accessToken && pathname !== '/chat') {
			router.push('/chat');
		}
	}, [accessToken, router, pathname]);

	const value = { accessToken, refreshToken, login, logout };

	return (
		<AuthContext.Provider value={value}>
			{accessToken ? (
				<WebSocketContextProvider token={accessToken}>
					{children}
				</WebSocketContextProvider>
			) : (
				children
			)}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}

	return context;
};

export function useJwtDecoded() {
	const { accessToken } = useAuth();
	if (accessToken !== null) {
		return decodeJwt(accessToken);
	}

	return null;
}
