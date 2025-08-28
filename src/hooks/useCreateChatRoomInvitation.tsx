import { useState } from 'react';
import { useWebSocket } from './useWebSocket';
import { CreateChatRoomInvitation } from '@/types/types';

export default function useCreateChatRoomInvitation() {
	const [createChatRoomInvitation, setCreateChatRoomInvitation] =
		useState<CreateChatRoomInvitation | null>(null);
	const webSocketPath = '/user/queue/chatroom/create';

	useWebSocket(webSocketPath, (response) => {
		const message = response as CreateChatRoomInvitation;
		setCreateChatRoomInvitation(message);
	});

	return {
		createChatRoomInvitation,
	};
}
