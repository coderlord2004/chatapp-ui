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

	useWebSocket(webSocketPath, (message: MessageResponseType) => {
		console.log('message response:', message);
		message.isFake = false;
		message.sending = false;
		setMessages((prev) => [
			...prev.filter((message) => message.isFake !== true),
			message,
		]);
	});

	function insertFakeMessages(fakeMessage: MessageResponseType) {
		setMessages((prev) => [...prev, fakeMessage]);
	}

	function deleteMessage(messageId: number) {
		setMessages((prev) =>
			prev.map((m) => {
				if (m.id === messageId) {
					return {
						...m,
						message: 'Đã thu hồi tin nhắn',
					};
				}
				return m;
			}),
		);
	}

	return {
		messages,
		insertFakeMessages,
		deleteMessage,
	};
}
