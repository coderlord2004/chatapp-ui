'use client';

import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from 'react';

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

	useEffect(() => {
		const storedAccess = localStorage.getItem('accessToken');
		const storedRefresh = localStorage.getItem('refreshToken');
		if (storedAccess && storedRefresh) {
			setAccessToken(storedAccess);
			setRefreshToken(storedRefresh);
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
		localStorage.removeItem('refresh');
		setAccessToken(null);
		setRefreshToken(null);
	};

	const value = { accessToken, refreshToken, login, logout };

	// Nếu đã đăng nhập => bọc children với WebSocketProvider
	if (accessToken) {
		return (
			<AuthContext.Provider value={value}>
				<WebSocketContextProvider token={accessToken}>
					{children}
				</WebSocketContextProvider>
			</AuthContext.Provider>
		);
	}
	console.log('accessToken invalid.');
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
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
