type ChatRoomInfo = {
	id: number | null;
	name: string | null;
	avatar: undefined | string | Blob;
	membersUsername: string[];
	type: 'GROUP' | 'DUO';
	createdOn: string;
	latestMessage: LatestMessageType | null;
};

type AttachmentType = {
	source: string;
	type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'RAW' | 'DOCUMENT';
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
	attachments: AttachmentType[];
	sending?: boolean;
	isFake?: boolean;
};

type LatestMessageType = {
	sender: string;
	message: string;
	sentOn: string;
	attachments: AttachmentType[];
};

export type {
	ChatRoomInfo,
	Invitation,
	MessageRequestType,
	MessageResponseType,
	LatestMessageType,
};
