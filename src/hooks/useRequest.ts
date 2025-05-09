// hooks/useRequest.ts
'use client'

import { useNotification } from './useNotification'
import { isAxiosError } from 'axios'
import request from '@/utils/request'

export const useRequest = () => {
    const { showNotification } = useNotification()

    const get = async (url: string, config = {}) => {
        try {
            const response = await request.get(url, config)
            return response.data
        } catch (error) {
            handleError(error)
            throw error
        }
    }

    const post = async (url: string, data = {}, config = {}) => {
        try {
            const response = await request.post(url, data, config)
            return response.data
        } catch (error) {
            handleError(error)
            throw error
        }
    }

    const handleError = (error: unknown) => {
        if (isAxiosError(error)) {
            console.log('error: ', error)
            const message = error.response?.data?.message || error.message || 'Lỗi từ máy chủ.'
            showNotification({ type: 'error', message })
        } else {
            showNotification({ type: 'error', message: 'Lỗi không xác định.' })
        }
    }

    return { get, post }
}
