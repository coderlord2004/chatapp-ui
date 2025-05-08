// utils/request.ts
'use client'

import axios from 'axios'

const getAccessToken = () => {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('accessToken')
	}
	return null
}

const request = axios.create({
	baseURL: process.env.NEXT_PUBLIC_WEBCHAT_BASE_URL,
	timeout: 15000,
})

request.interceptors.request.use(
	(config) => {
		const token = getAccessToken()
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	(error) => Promise.reject(error)
)

export default request
