import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { type Client, messageCallbackType } from '@stomp/stompjs';
import { decodeJwt } from 'jose';

import getStompClient from '@/services/websocket';

const WebSocketContext = createContext<Client | null | undefined>(undefined);

interface Props {
	token: string;
	children?: ReactNode;
}

function WebSocketContextProvider({ children, token }: Props) {
	const [stompClient, setStompClient] = useState<Client | null>(null);
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

function useWebSocket(destination: string, callback: messageCallbackType) {
	const stompClient = useContext(WebSocketContext);

	const useOutsideContext = stompClient === undefined;
	const isDevEnvironment = process.env.NODE_ENV === 'development';

	if (useOutsideContext && isDevEnvironment) {
		throw new Error('You are using useWebSocket outside context provider.');
	}

	useEffect(() => {
		if (!stompClient) {
			return;
		}

		const subscription = stompClient.subscribe(destination, callback);
		return () => {
			subscription.unsubscribe();
		};
	}, [stompClient, destination, callback]);
}

export { WebSocketContextProvider, useWebSocket };
