import { createContext } from 'react';
import { Client } from '@stomp/stompjs';

const WebSocketContext = createContext<Client | undefined>(undefined);

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

export { getStompClient, WebSocketContext };
