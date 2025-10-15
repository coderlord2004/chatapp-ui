'use client';

import axios, {
	AxiosResponseHeaders,
	CreateAxiosDefaults,
	type AxiosRequestHeaders,
} from 'axios';
import { decode, encode } from '@msgpack/msgpack';
import camelcaseKeys from 'camelcase-keys';
import {
	getAccessToken,
	getLocalStorage,
	getNewAccessToken,
	getRefreshToken,
} from './jwts';
import { routes } from '@/lib/routes';

const logout = () => {
	if (typeof window === 'undefined') {
		return null;
	}

	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
	window.location.href = routes.login;
};

const refreshAccessToken = async () => {
	try {
		const refreshToken = getRefreshToken();
		if (!refreshToken) throw new Error('No refresh token');

		const newAccessToken = await getNewAccessToken(refreshToken);
		getLocalStorage()?.setItem('accessToken', newAccessToken);
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

let textEncoder: TextDecoder | undefined;

function decodeResponse(data: ArrayBuffer, headers: AxiosResponseHeaders) {
	if (headers['content-type'] === MSGPACK_CONTENT_TYPE) {
		return decode(data);
	}

	if (textEncoder === undefined) {
		textEncoder = new TextDecoder('utf-8');
	}

	return JSON.parse(textEncoder.decode(data));
}

let config: CreateAxiosDefaults = {
	baseURL: process.env.NEXT_PUBLIC_WEBCHAT_BASE_URL,
};

// if (process.env.NODE_ENV === 'production') {
// 	config = {
// 		headers: { Accept: MSGPACK_CONTENT_TYPE },
// 		transformResponse: [decodeResponse],
// 		transformRequest: [encodeRequest],
// 		responseType: 'arraybuffer',
// 		...config,
// 	};
// }

const request = axios.create(config);
export const normalRequest = axios.create(config);

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
	(response) => {
		response.data = camelcaseKeys(response.data, { deep: true });
		return response;
	},
	async (error) => {
		const originalRequest = error.config;
		const accessTokenExpired = error.response?.status === 401;

		if (!accessTokenExpired || originalRequest._retry === true) {
			return Promise.reject(error);
		}

		originalRequest._retry = true;

		const newAccessToken = await refreshAccessToken();
		originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
		return request(originalRequest);
	},
);

export default request;
