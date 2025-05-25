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

	useWebSocket(webSocketPath, (response) => {
		const message = response as MessageResponseType;
		message.isFake = false;
		message.sending = false;
		setMessages((prev) => [
			...prev.filter((message) => message.isFake !== true),
			message,
		]);
	});

	function updateMessages(fakeMessage: MessageResponseType) {
		setMessages((prev) => [...prev, fakeMessage]);
	}

	return {
		messages,
		updateMessages,
	};
}
