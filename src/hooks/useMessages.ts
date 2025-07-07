import { useRequest } from '@/hooks/useRequest';
import { useEffect, useState } from 'react';
import { useWebSocket } from './useWebSocket';
import { useAuth } from '@/contexts/AuthContext';
import { MessageResponseType } from '@/types/types';

export default function useMessages(roomId: string, page: number) {
	const [messages, setMessages] = useState<MessageResponseType[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const { accessToken } = useAuth();
	const { get } = useRequest();
	const webSocketPath = `/user/queue/chat/${roomId}`;

	useEffect(() => {
		async function getChatRoomMessage() {
			const data = await get(`messages/`, {
				params: { page, room: roomId },
			});

			setIsLoading(false);
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

	function insertFakeMessage(fakeMessage: MessageResponseType) {
		setMessages((prev) => [...prev, fakeMessage]);
	}

	function updateMessage(
		messageId: number,
		newMessage: string,
		sending: boolean,
		isUpdated: boolean,
	) {
		setMessages((prev) =>
			prev.map((m) => {
				if (m.id !== messageId) {
					return m;
				}

				return {
					...m,
					message: newMessage,
					sending,
					isUpdated,
				};
			}),
		);
	}

	function deleteMessage(messageId: number) {
		setMessages((prev) =>
			prev.map((m) => {
				if (m.id !== messageId) {
					return m;
				}

				return {
					...m,
					message: 'Đã thu hồi tin nhắn',
				};
			}),
		);
	}

	return {
		messages,
		insertFakeMessage,
		updateMessage,
		deleteMessage,
		isLoading,
	};
}
