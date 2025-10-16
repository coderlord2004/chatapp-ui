'use client';

import { useNotification } from './useNotification';
import { AxiosRequestConfig, isAxiosError } from 'axios';
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

			if (error.response) {
				console.log('Response error: ', error.response);
				const message =
					error.response.data?.message ||
					error.response.data?.title ||
					error.response.data?.detail ||
					`Lỗi ${error.response.status}`;
				showNotification({ type: 'error', message });
			} else if (error.request) {
				// Request gửi đi nhưng không nhận được phản hồi hợp lệ
				console.log('No response received: ', error.request);
				showNotification({
					type: 'error',
					message:
						'Không nhận được phản hồi từ máy chủ (có thể do CORS hoặc mất kết nối).',
				});
			} else {
				// Lỗi khác (cấu hình, v.v.)
				console.log('Axios config error: ', error.message);
				showNotification({ type: 'error', message: error.message });
			}
		},
		[showNotification],
	);

	const get = useCallback(
		async (url: string, config?: AxiosRequestConfig) => {
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
		async (url: string, data = {}, config?: AxiosRequestConfig) => {
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

	const remove = useCallback(
		async (url: string, config = {}) => {
			try {
				const response = await request.delete(url, config);
				return response.data;
			} catch (error) {
				handleError(error);
				throw error;
			}
		},
		[handleError],
	);

	const put = useCallback(
		async (url: string, data = {}, config = {}) => {
			try {
				const response = await request.put(url, data, config);
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

	return { get, post, put, patch, remove, handleError };
};
