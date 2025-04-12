import {
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import { Client } from '@stomp/stompjs';
import { decodeJwt } from 'jose';

import { getStompClient, WebSocketContext } from '@/services/websocket';

interface Props {
	token: string;
	children?: ReactNode;
}

export default function WebSocketContextProvider({ children, token }: Props) {
	const [stompClient, setStompClient] = useState<Client | undefined>(undefined);
	const jwtIssuer = useRef<string | undefined>(undefined);

	const updateStompClient = useCallback(async () => {
		const { sub } = decodeJwt(token);

		if (sub === jwtIssuer.current) {
			return;
		}

		const stompClient = await getStompClient(token);
		setStompClient(stompClient);
		jwtIssuer.current = sub;
	}, [token]);

	useEffect(() => {
		updateStompClient();
	}, [updateStompClient]);

	useEffect(() => {
		return () => {
			stompClient?.deactivate({ force: true });
		};
	}, [stompClient]);

	return (
		<WebSocketContext.Provider value={stompClient}>
			{children}
		</WebSocketContext.Provider>
	);
}
