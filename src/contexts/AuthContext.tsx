'use client';

import {
	createContext,
	useContext,
	useEffect,
	useState,
	PropsWithChildren,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { decodeJwt } from 'jose';
import { WebSocketContextProvider } from '@/hooks/useWebSocket';
import { getAccessToken, getRefreshToken } from '@/utils/request';

type AuthContextType = {
	accessToken: string | null;
	refreshToken: string | null;
	login: (accessToken: string, refreshToken: string) => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
	const [accessToken, setAccessToken] = useState<string | null>(
		getAccessToken() || null,
	);
	const [refreshToken, setRefreshToken] = useState<string | null>(
		getRefreshToken() || null,
	);

	const router = useRouter();
	const pathname = usePathname();

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
	useEffect(() => {
		// TODO: check if accessToken valid
		if (accessToken && pathname !== '/chat') {
			router.push('/chat');
		} else if (!accessToken && pathname !== '/signup') {
			router.push('/login');
		}
	}, [accessToken, router, pathname]);

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
