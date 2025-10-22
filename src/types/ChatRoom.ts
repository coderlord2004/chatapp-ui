import { MessageResponseType } from './Message';
import { AttachmentType } from './Attachment';
import { UserWithAvatar } from './User';

type ChatRoomInfo = {
	id: number | null;
	name: string | null;
	avatar: string | null;
	members: UserWithAvatar[];
	type: 'GROUP' | 'DUO';
	createdOn: string;
	leader: UserWithAvatar | null;
	leaderOnlySend: boolean;
	isWaitingRoom: boolean;
	latestMessage: MessageResponseType | null;
	firstMessagePage: MessageResponseType[] | null;
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
