import axios from 'axios';
import { decodeJwt } from 'jose';

export function getLocalStorage() {
	if (typeof window === 'undefined') {
		return null;
	}

	return localStorage;
}

export const getAccessToken = () => {
	return getLocalStorage()?.getItem('accessToken') || null;
};

export const getRefreshToken = () => {
	return getLocalStorage()?.getItem('refreshToken') || null;
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

export async function getNewAccessToken(refreshToken: string) {
	const response = await axios.post(
		'/users/token/refresh/',
		{ refresh: refreshToken },
		{ baseURL: process.env.NEXT_PUBLIC_WEBCHAT_BASE_URL },
	);

	return response.data.access;
}

export async function isAuthorized() {
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
