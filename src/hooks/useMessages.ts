import { useRequest } from '@/hooks/useRequest';
import { useEffect, useState } from 'react';
import { useWebSocket } from './useWebSocket';
import { useAuth } from '@/contexts/AuthContext';
import { MessageResponseType } from '@/types/types';

export default function useMessages(roomId: string, page: number) {
	const [messages, setMessages] = useState<MessageResponseType[]>([]);
	const { accessToken } = useAuth();
	const { get } = useRequest();
	const webSocketPath = `/user/queue/chat/${roomId}`;

	useEffect(() => {
		async function getChatRoomMessage() {
			const data = await get(`messages/`, {
				params: { page, room: roomId },
			});

			setMessages(data);
		}
		getChatRoomMessage();
	}, [roomId, page, accessToken, get]);

	useWebSocket(webSocketPath, (message) => {
		console.log('message response:', message);
		setMessages((prev) => [...prev, message as MessageResponseType]);
	});

	return messages;
}
