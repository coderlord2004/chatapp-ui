import { MessageResponseType } from './Message';
import { AttachmentType } from './Attachment';

type ChatRoomInfo = {
	id: number | null;
	name: string | null;
	avatar: string | null;
	membersUsername: string[];
	type: 'GROUP' | 'DUO';
	createdOn: string;
	latestMessage: MessageResponseType | null;
};
type CreateChatRoom = {
	name: string | null;
	avatar: AttachmentType | null;
	membersUsername: string[];
	type: 'GROUP' | 'DUO';
	createdOn: string;
};

type CreateChatRoomInvitation = {
	sender: string;
	chatRoom: ChatRoomInfo;
};

export type { ChatRoomInfo, CreateChatRoom, CreateChatRoomInvitation };
