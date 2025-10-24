import { createContext, useContext, Dispatch, SetStateAction } from 'react';
import { ChatRoomInfo } from '@/types/ChatRoom';

type ChatRoomContextType = {
	chatRooms: ChatRoomInfo[];
	createLatestChatRoom: (c: ChatRoomInfo) => void;
	updateChatRoom: (id: number, c: ChatRoomInfo) => void;
};

export const ChatRoomsContext = createContext<ChatRoomContextType | null>(null);

export const useChatRooms = () => {
	const context = useContext(ChatRoomsContext);
	if (!context) {
		throw new Error('useChatRooms must be used within a ChatRoomsProvider');
	}

	return context;
};
