import { type ReactNode, useCallback, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { decodeJwt } from 'jose';

import { getStompClient, WebSocketContext } from '@/services/websocket';

interface Props {
	token: string;
	children?: ReactNode;
}

export default function WebSocketContextProvider({ children, token }: Props) {
	const stompClientRef = useRef<Client | undefined>(undefined);
	const jwtIssuer = useRef<string | undefined>(undefined);

	const updateStompClient = useCallback(async () => {
		const { iss } = decodeJwt(token);
		if (iss === jwtIssuer.current) {
			return;
		}

		const stompClient = await getStompClient(token);
		stompClientRef.current = stompClient;

		jwtIssuer.current = iss;
	}, [token]);

	useEffect(() => {
		updateStompClient();
	}, [updateStompClient]);

	useEffect(() => {
		return () => {
			stompClientRef.current?.deactivate({ force: true });
		};
	}, [stompClientRef]);

	return (
		<WebSocketContext.Provider value={stompClientRef}>
			{children}
		</WebSocketContext.Provider>
	);
}
