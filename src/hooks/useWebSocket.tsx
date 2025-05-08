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

const WebSocketContext = createContext<Client | undefined>(undefined);

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
			console.log('messageBody:', messageBody);
			callback(messageBody);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [stompClient, destination, callback]);
}

export { WebSocketContextProvider, useWebSocket };
