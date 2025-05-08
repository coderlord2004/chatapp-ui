'use client';

import { PropsWithChildren } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { WebSocketContextProvider } from '@/hooks/useWebSocket';

export default function Layout({ children }: PropsWithChildren) {
	const { accessToken } = useAuth();

	return (
		<>
			{accessToken ? (
				<WebSocketContextProvider token={accessToken}>
					{children}
				</WebSocketContextProvider>
			) : (
				children
			)}
		</>
	);
}
