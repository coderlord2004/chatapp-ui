'use client';

import { PropsWithChildren } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { WebSocketContextProvider } from '@/hooks/useWebSocket';
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";

function WebSocketProvider({ children }: PropsWithChildren) {
	const { accessToken } = useAuth();

	if (!accessToken) {
		return null;
	}

	const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

	return (
		<WebSocketContextProvider token={accessToken}>
			<AgoraRTCProvider client={client}>
				{children}
			</AgoraRTCProvider>
		</WebSocketContextProvider>
	);
}

export default function Layout({ children }: PropsWithChildren) {
	return (
		<AuthProvider>
			<WebSocketProvider>
				{children}
			</WebSocketProvider>
		</AuthProvider>
	);
}
