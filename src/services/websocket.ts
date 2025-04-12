import { Client } from '@stomp/stompjs';

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

export default getStompClient;
