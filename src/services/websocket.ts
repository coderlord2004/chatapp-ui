import { createContext, type RefObject, useContext, useEffect } from 'react';
import { Client, messageCallbackType } from '@stomp/stompjs';

type RefClient = RefObject<Client | undefined>;
const WebSocketContext = createContext<RefClient | undefined>(undefined);

async function getStompClient(token: string): Promise<Client> {
	const client = new Client({
		brokerURL: process.env.NEXT_PUBLIC_WS_BROKERURL,
		connectHeaders: {
			Authorization: `Bearer ${token}`,
		},
	});

	return new Promise((resolve, reject) => {
		client.onConnect = (frame) => {
			console.log(frame);
			resolve(client);
		};

		client.onWebSocketError = (error) => {
			reject(error);
		};

		client.activate();
	});
}

function useWebSocket(destination: string, callback: messageCallbackType) {
	const stompClientRef = useContext(WebSocketContext);

	useEffect(() => {
		const stompClient = stompClientRef?.current;
		if (stompClient == undefined) {
			return;
		}

		const subscription = stompClient.subscribe(destination, callback);
		return () => {
			subscription.unsubscribe();
		};
	}, [stompClientRef, destination, callback]);
}

export { getStompClient, useWebSocket, WebSocketContext };
