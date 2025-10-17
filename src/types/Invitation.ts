import { ChatRoomInfo } from './ChatRoom';
import { UserWithAvatar } from './User';

type Invitation = {
	id: number;
	sender: UserWithAvatar;
	receiver: UserWithAvatar;
	chatRoomId: number | null;
	chatRoomDto: ChatRoomInfo;
	status: 'PENDING' | 'REJECTED' | 'ACCEPTED';
	restriction: 'NONE' | 'BLOCKED' | 'MUTED';
};
type CallInvitation = {
	channelId: number;
	caller: UserWithAvatar;
	members: UserWithAvatar[];
	isUseVideo: boolean;
};

export type { Invitation, CallInvitation };
