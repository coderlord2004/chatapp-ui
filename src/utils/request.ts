'use client'

import axios from 'axios'

const getAccessToken = () => {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('accessToken')
	}
	return null
}

const getRefreshToken = () => {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('refreshToken')
	}
	return null
}

const logout = () => {
	localStorage.removeItem('accessToken')
	localStorage.removeItem('refreshToken')
	window.location.href = '/login'
}

const refreshAccessToken = async () => {
	try {
		const refreshToken = getRefreshToken()
		if (!refreshToken) throw new Error('No refresh token')

		const response = await axios.post(
			`${process.env.NEXT_PUBLIC_WEBCHAT_BASE_URL}users/token/refresh/`,
			{ refresh: refreshToken }
		)

		const newAccessToken = response.data.access
		localStorage.setItem('accessToken', newAccessToken)
		return newAccessToken
	} catch (err) {
		logout()
		throw err
	}
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

request.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true
			try {
				const newAccessToken = await refreshAccessToken()
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
				return request(originalRequest)
			} catch (refreshError) {
				return Promise.reject(refreshError)
			}
		}

		return Promise.reject(error)
	}
)

export default request
