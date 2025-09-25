'use client';

import { PropsWithChildren } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { WebSocketContextProvider } from '@/hooks/useWebSocket';
import dynamic from 'next/dynamic';

const AgoraProvider = dynamic(() => import('@/contexts/AgoraRTCProvider'), {
	ssr: false,
});

function WebSocketProvider({ children }: PropsWithChildren) {
	const { accessToken } = useAuth();
	if (!accessToken) return null;

	return (
		<WebSocketContextProvider token={accessToken}>
			<AgoraProvider>{children}</AgoraProvider>
		</WebSocketContextProvider>
	);
}

export default function Layout({ children }: PropsWithChildren) {
	return (
		<AuthProvider>
			<WebSocketProvider>{children}</WebSocketProvider>
		</AuthProvider>
	);
}
