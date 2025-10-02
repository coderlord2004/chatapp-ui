import { UserWithAvatar } from './User';

type CommentType = {
	id: number;
	content: string;
	commentedAt: string;
	user: UserWithAvatar;
};

type CommentResponse = {
	commentData: CommentType;
	totalChildComments: number;
};

export type { CommentType, CommentResponse };
