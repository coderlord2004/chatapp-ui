type ChatRoomInfo = {
	id: number;
	name: string;
	avatar: undefined | string | Blob;
	membersUsername: [];
	type: 'GROUP' | 'DUO';
	createdOn: Date;
};

type Invitation = {
	id: number;
	sender: string;
	receiver: string;
	chatRoomId: number | null;
	status: 'PENDING' | 'REJECTED' | 'ACCEPTED';
};

type MessageTypes = {
	message: string;
	file?: File;
	json?: object;
};

export type { ChatRoomInfo, Invitation, MessageTypes };
