'use client';

import {
	createContext,
	useContext,
	useEffect,
	useState,
	PropsWithChildren,
	useCallback,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { decodeJwt } from 'jose';
import {
	getAccessToken,
	getNewAccessToken,
	getRefreshToken,
} from '@/utils/jwts';
import { useRequest } from '@/hooks/useRequest';
import { useNotification } from '@/hooks/useNotification';

type AuthUserType = {
	id: number;
	username: string;
	avatar: string | null;
};

type AuthContextType = {
	authUser: AuthUserType | null;
	accessToken: string | null;
	refreshToken: string | null;
	login: (accessToken: string, refreshToken: string) => void;
	logout: () => void;
};

type TokenTypes = {
	accessToken: string | null;
	refreshToken: string | null;
};

function isTokenValid(token: string | null) {
	if (token === null) {
		return false;
	}

	try {
		const payload = decodeJwt(token);

		let exp = 0;
		if (payload.exp !== undefined) {
			exp = payload.exp * 1000;
		}

		return exp - 60 > Date.now();
	} catch {
		return false;
	}
}

async function isAuthorized() {
	const refreshToken = getRefreshToken();
	if (!isTokenValid(refreshToken)) {
		return false;
	}

	const accessToken = getAccessToken();
	if (isTokenValid(accessToken)) {
		return true;
	}

	try {
		const accessToken = await getNewAccessToken(refreshToken!);
		localStorage.setItem('accessToken', accessToken);

		return true;
	} catch {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');

		return false;
	}
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
	const [token, setToken] = useState<TokenTypes>({
		accessToken: null,
		refreshToken: null,
	});
	const [authUser, setAuthUser] = useState<AuthUserType | null>(null);
	const { get } = useRequest();
	const router = useRouter();
	const pathname = usePathname();
	const { showNotification } = useNotification();

	const login = (accessToken: string, refreshToken: string) => {
		localStorage.setItem('accessToken', accessToken);
		localStorage.setItem('refreshToken', refreshToken);
		setToken({ accessToken, refreshToken });
	};

	const logout = useCallback(() => {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		setToken({ accessToken: null, refreshToken: null });
		router.push('/login');
	}, [router]);

	useEffect(() => {
		const getAuthUser = async () => {
			const data = await get('users/info/');
			setAuthUser(data);
		};

		if (token.accessToken) {
			getAuthUser();
		}
	}, [token]);

	useEffect(() => {
		async function checkIfLoggedIn() {
			if (!(await isAuthorized())) {
				logout();
				return;
			}

			const storedAccessToken = getAccessToken();
			const storedRefreshToken = getRefreshToken();

			if (storedAccessToken && storedRefreshToken) {
				setToken({
					accessToken: storedAccessToken,
					refreshToken: storedRefreshToken,
				});
			}
		}

		checkIfLoggedIn();
	}, [logout]);

	useEffect(() => {
		if (!token.accessToken || !token.refreshToken) return;

		if (token.accessToken && pathname !== '/chat') {
			router.push('/chat');
		}
	}, [token, router, pathname]);

	const value = {
		authUser,
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
