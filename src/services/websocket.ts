import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

async function getStompClient(token: string): Promise<Client> {
	const brokerURL = process.env.NEXT_PUBLIC_WS_BROKERURL!;
	const socket = new SockJS(brokerURL);

	const client = new Client({
		webSocketFactory: () => socket,
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

export default getStompClient;
