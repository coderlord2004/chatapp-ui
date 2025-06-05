'use client';

import { PropsWithChildren } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { WebSocketContextProvider } from '@/hooks/useWebSocket';

function WebSocketProvider({ children }: PropsWithChildren) {
	const { accessToken } = useAuth();

	if (!accessToken) {
		return null;
	}

	return (
		<WebSocketContextProvider token={accessToken}>
			{children}
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
