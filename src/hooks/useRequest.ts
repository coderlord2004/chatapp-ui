'use client';

import { useNotification } from './useNotification';
import { isAxiosError } from 'axios';
import request from '@/utils/request';
import { useCallback } from 'react';

export const useRequest = () => {
	const { showNotification } = useNotification();

	const handleError = useCallback(
		(error: unknown) => {
			if (!isAxiosError(error)) {
				showNotification({ type: 'error', message: 'Lỗi không xác định.' });
				return;
			}

			console.log('error: ', error);
			const message =
				error.response?.data?.message || error.message || 'Lỗi từ máy chủ.';
			showNotification({ type: 'error', message });
		},
		[showNotification],
	);

	const get = useCallback(
		async (url: string, config = {}) => {
			try {
				const response = await request.get(url, config);
				return response.data;
			} catch (error) {
				handleError(error);
				throw error;
			}
		},
		[handleError],
	);

	const post = useCallback(
		async (url: string, data = {}, config = {}) => {
			try {
				const response = await request.post(url, data, config);
				return response.data;
			} catch (error) {
				handleError(error);
				throw error;
			}
		},
		[handleError],
	);

	const patch = useCallback(
		async (url: string, data = {}, config = {}) => {
			try {
				const response = await request.patch(url, data, config);
				return response.data;
			} catch (error) {
				handleError(error);
				throw error;
			}
		},
		[handleError],
	);

	return { get, post, patch };
};
