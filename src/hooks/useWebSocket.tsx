import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { type Client } from '@stomp/stompjs';
import { Mutex } from 'async-mutex';
import { decodeJwt } from 'jose';

import getStompClient from '@/services/websocket';

interface ContextType {
	stompClient?: Client;
}

const WebSocketContext = createContext<ContextType | undefined>(undefined);

interface Props {
	token: string;
	children?: ReactNode;
}

function WebSocketContextProvider({ children, token }: Props) {
	const [stompClient, setStompClient] = useState<Client | undefined>(undefined);
	const jwtIssuer = useRef<string | undefined>(undefined);

	const mutex = useRef(new Mutex());

	useEffect(() => {
		const abortController = new AbortController();
		const signal = abortController.signal;

		// TODO: handle exception when decodeJwt and connect to client
		mutex.current.runExclusive(async () => {
			const { sub } = decodeJwt(token);
			const isNewUser = sub !== jwtIssuer.current;

			if (!isNewUser) {
				return;
			}

			const stompClient = await getStompClient(token, signal);
			setStompClient(stompClient);
			jwtIssuer.current = sub;
		});

		return () => abortController.abort();
	}, [token]);

	useEffect(() => {
		return () => {
			stompClient?.deactivate({ force: true });
		};
	}, [stompClient]);

	return (
		<WebSocketContext.Provider value={{ stompClient }}>
			{children}
		</WebSocketContext.Provider>
	);
}

type Callback = (messageBody: unknown) => void;

function useWebSocket(destination: string, callback: Callback) {
	const context = useContext(WebSocketContext);

	useEffect(() => {
		if (context === undefined) {
			throw new Error(
				'You called useWebSocket outside WebSocketContextProvider',
			);
		}

		const { stompClient } = context;
		if (!stompClient || !destination) {
			return;
		}

		const subscription = stompClient.subscribe(destination, (message) => {
			const messageBody = JSON.parse(message.body);
			callback(messageBody);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [context, destination, callback]);
}

export { WebSocketContext, WebSocketContextProvider, useWebSocket };
