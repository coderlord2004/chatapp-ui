import { useRequest } from '@/hooks/useRequest';
import { useEffect, useState } from 'react';
import { useWebSocket } from './useWebSocket';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
	id: number;
	sender: string;
	message: string;
	timestamp?: string;
}

function useMessages(roomId: string) {
	const [messages, setMessages] = useState<Message[]>([]);
	const { accessToken } = useAuth();
	const { get } = useRequest();
	const webSocketPath = `/user/queue/chat/${roomId}`;

	useEffect(() => {
		async function getChatRoomMessage() {
			const data = await get(`messages/${roomId}`);

			setMessages(data);
		}
		getChatRoomMessage();
	}, [roomId, accessToken, get]);

	useWebSocket(webSocketPath, (message) => {
		setMessages((prev) => [...prev, message as Message]);
	});

	return messages;
}

function useLastMessages(roomId: string) {
	const messages = useMessages(roomId);

	return {
		sender: messages[messages.length - 1].sender,
		message: messages[messages.length - 1],
	};
}

export { useMessages, useLastMessages };
