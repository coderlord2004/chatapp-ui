import { UserWithAvatar } from "./User";

type Notification = {
    id: number;
    title: string;
    content: string;
    sender: UserWithAvatar;
    receiver: UserWithAvatar;
    isRead: boolean;
    sentOn: string;
    type: 'FRIEND_REQUEST' | 'MESSAGE' | 'SYSTEM' | 'COMMENT' | 'REACTION' | 'POST' | 'INVITATION';
    targetId?: number;
    targetType?: 'POST' | 'COMMENT';
}

export type { Notification };