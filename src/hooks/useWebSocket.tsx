import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { type Client } from '@stomp/stompjs';
import { decodeJwt } from 'jose';

import getStompClient from '@/services/websocket';

const WebSocketContext = createContext<Client | undefined>(undefined);

interface Props {
	token: string;
	children?: ReactNode;
}

function WebSocketContextProvider({ children, token }: Props) {
	const [stompClient, setStompClient] = useState<Client | undefined>(undefined);
	const jwtIssuer = useRef<string | undefined>(undefined);

	// TODO: handle exception when decodeJwt and connect to client
	const updateStompClient = useCallback(async () => {
		const { sub } = decodeJwt(token);
		const isNewUser = sub !== jwtIssuer.current;

		if (!isNewUser) {
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

type Callback = (messageBody: unknown) => void;

function useWebSocket(destination: string | undefined, callback: Callback) {
	const stompClient = useContext(WebSocketContext);

	useEffect(() => {
		if (!stompClient || destination === undefined) {
			return;
		}

		const subscription = stompClient.subscribe(destination, (message) => {
			const messageBody = JSON.parse(message.body);
			callback(messageBody);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [stompClient, destination, callback]);
}

export { WebSocketContextProvider, useWebSocket };
