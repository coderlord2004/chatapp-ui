'use client';

import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { decodeJwt } from 'jose';

type AuthContextType = {
	accessToken: string | null;
	refreshToken: string | null;
	login: (accessToken: string, refreshToken: string) => void;
	logout: () => void;
};

type TokenTypes = {
	accessToken: string | null;
	refreshToken: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
	const [token, setToken] = useState<TokenTypes>({
		accessToken: null,
		refreshToken: null,
	});

	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const storedAccessToken = localStorage.getItem('accessToken');
		const storedRefreshToken = localStorage.getItem('refreshToken');

		if (storedAccessToken && storedRefreshToken) {
			setToken({
				accessToken: storedAccessToken,
				refreshToken: storedRefreshToken,
			});
		}
	}, []);

	const login = (accessToken: string, refreshToken: string) => {
		localStorage.setItem('accessToken', accessToken);
		localStorage.setItem('refreshToken', refreshToken);
		setToken({ accessToken, refreshToken });
	};

	const logout = () => {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		setToken({ accessToken: null, refreshToken: null });
		router.push('/login');
	};

	useEffect(() => {
		if (!token.accessToken || !token.refreshToken) return;

		if (token.accessToken && pathname !== '/chat') {
			router.push('/chat');
		}
	}, [token, router, pathname]);

	const value = {
		accessToken: token.accessToken,
		refreshToken: token.refreshToken,
		login,
		logout,
	};

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
