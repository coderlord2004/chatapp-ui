'use client';

import { PropsWithChildren } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { WebSocketContextProvider } from '@/hooks/useWebSocket';

export default function Layout({ children }: PropsWithChildren) {
	const { accessToken } = useAuth();

	if (!accessToken) return null;

	return (
		<WebSocketContextProvider token={accessToken}>
			{children}
		</WebSocketContextProvider>
	);
}
