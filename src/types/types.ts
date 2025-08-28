type ChatRoomInfo = {
	id: number | null;
	name: string | null;
	avatar: undefined | string | Blob;
	membersUsername: string[];
	type: 'GROUP' | 'DUO';
	createdOn: string;
	latestMessage: MessageResponseType | null;
};

type AttachmentType = {
	source: string;
	type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'RAW' | 'DOCUMENT';
	format: string;
};

type AuthUser = {
	id: number;
	username: string;
	avatar: string;
};

type Invitation = {
	id: number;
	sender: AuthUser;
	receiver: AuthUser;
	chatRoomId: number | null;
	chatRoomDto: ChatRoomInfo;
	status: 'PENDING' | 'REJECTED' | 'ACCEPTED';
};

type MessageRequestType = {
	message: string;
	file?: File;
	json?: object;
};

type MessageResponseType = {
	id: number;
	sender: string;
	message: string | null;
	sentOn?: string;
	attachments: AttachmentType[] | null;
	sending?: boolean;
	isFake?: boolean;
	isUpdated?: boolean;
};

type GlobalMessageResponse = {
	roomId: number;
	message: MessageResponseType;
};

type SignalMessage = {
	type: 'offer' | 'answer' | 'candidate';
	caller: string;
	target: string;
	sdp?: RTCSessionDescriptionInit;
	candidate?: RTCIceCandidateInit;
};

type UpdateMessageParams = {
	messageId: number;
	newMessage: string;
	sending: boolean;
	isUpdated: boolean;
};

type CallInvitation = {
	channelId: number;
	caller: AuthUser;
	membersUsername: string[];
	isUseVideo: boolean;
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

export type {
	AuthUser,
	ChatRoomInfo,
	Invitation,
	MessageRequestType,
	MessageResponseType,
	GlobalMessageResponse,
	SignalMessage,
	UpdateMessageParams,
	CallInvitation,
	CreateChatRoom,
	CreateChatRoomInvitation,
};
