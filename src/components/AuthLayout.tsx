'use client';

import { PropsWithChildren } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { WebSocketContextProvider } from '@/hooks/useWebSocket';
import { SearchUserProvider } from '@/hooks/useSearchUser';
import dynamic from 'next/dynamic';

const AgoraProvider = dynamic(() => import('@/contexts/AgoraRTCProvider'), {
	ssr: false,
});

function WebSocketProvider({ children }: PropsWithChildren) {
	const { accessToken } = useAuth();
	if (!accessToken)
		return (
			<div className="gradientColor fixed inset-0 flex min-h-screen items-center justify-center bg-slate-800"></div>
		);

	return (
		<WebSocketContextProvider token={accessToken}>
			<AgoraProvider>{children}</AgoraProvider>
		</WebSocketContextProvider>
	);
}

export default function AuthLayout({ children }: PropsWithChildren) {
	return (
		<AuthProvider>
			<SearchUserProvider>
				<WebSocketProvider>{children}</WebSocketProvider>
			</SearchUserProvider>
		</AuthProvider>
	);
}
