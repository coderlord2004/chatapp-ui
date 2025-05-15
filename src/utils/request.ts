'use client';

import axios from 'axios';

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
			{ refresh: refreshToken },
		);

		const newAccessToken = response.data.access;
		localStorage.setItem('accessToken', newAccessToken);
		return newAccessToken;
	} catch (err) {
		logout();
		throw err;
	}
};

const request = axios.create({
	baseURL: process.env.NEXT_PUBLIC_WEBCHAT_BASE_URL,
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
