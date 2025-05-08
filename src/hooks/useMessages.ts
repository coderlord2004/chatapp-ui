import { get } from '@/utils/request';
import { useEffect, useState } from 'react';
import { useWebSocket } from './useWebSocket';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
	sender: string;
	message: string;
	timestamp?: string;
}

export default function useMessages(roomId: string) {
	const [messages, setMessages] = useState<Message[]>([]);
	const { accessToken } = useAuth();

	const webSocketPath = `/user/queue/chat/${roomId}`;

	useEffect(() => {
		async function getChatRoomMessage() {
			const data = await get(`messages/${roomId}`, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});

			setMessages(data);
		}
		getChatRoomMessage();
	}, [roomId, accessToken]);

	useWebSocket(webSocketPath, (message) => {
		setMessages((prev) => [...prev, message as Message]);
	});

	return messages;
}
