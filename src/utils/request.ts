'use client';

import axios, {
	type AxiosRequestHeaders,
	type AxiosResponseHeaders,
} from 'axios';

import { decode, encode } from '@msgpack/msgpack';

const getAccessToken = () => {
	if (typeof window === 'undefined') {
		return null;
	}
	return localStorage.getItem('accessToken');
};

const getRefreshToken = () => {
	if (typeof window === 'undefined') {
		return null;
	}
	return localStorage.getItem('refreshToken');
};

const logout = () => {
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
	window.location.href = '/login';
};

const refreshAccessToken = async () => {
	try {
		const refreshToken = getRefreshToken();
		if (!refreshToken) throw new Error('No refresh token');

		const response = await axios.post(
			`${process.env.NEXT_PUBLIC_WEBCHAT_BASE_URL}users/token/refresh/`,
			{ refresh: refreshToken }
		)
    
		const newAccessToken = response.data.access;
		localStorage.setItem('accessToken', newAccessToken);
		return newAccessToken;
	} catch (err) {
		logout();
		throw err;
	}
};

const MSGPACK_CONTENT_TYPE = 'application/x-msgpack';

function encodeRequest(data: unknown, headers: AxiosRequestHeaders) {
	if (!(data instanceof FormData)) {
		headers['Content-Type'] = MSGPACK_CONTENT_TYPE;
		data = encode(data);
	}

	return data;
}

function decodeResponse(data: ArrayBuffer, headers: AxiosResponseHeaders) {
	if (headers['content-type'] === MSGPACK_CONTENT_TYPE) {
		return decode(data);
	}

	return data;
}

const request = axios.create({
	baseURL: process.env.NEXT_PUBLIC_WEBCHAT_BASE_URL,
	headers: { Accept: MSGPACK_CONTENT_TYPE },
	transformResponse: [decodeResponse],
	transformRequest: [encodeRequest],
	responseType: 'arraybuffer',
	timeout: 15000,
});

request.interceptors.request.use(
	(config) => {
		const token = getAccessToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

request.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		const accessTokenExpired =
			error.response?.status === 401 && !originalRequest._retry;

		if (!accessTokenExpired) {
			return Promise.reject(error);
		}

		originalRequest._retry = true;

		const newAccessToken = await refreshAccessToken();
		originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
		return request(originalRequest);
	},
);

export default request;
