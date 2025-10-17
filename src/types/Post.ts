import { AttachmentType } from './Attachment';
import { UserInfo } from './User';
import { ReactionType } from './Reaction';

type SharedAttachment = {
	id: number;
	caption: string;
	captionBackground: number;
	visibility: 'PUBLIC' | 'FRIEND' | 'PRIVATE';
	publishedAt: string;
	attachment: AttachmentType;
};

type PostType = {
	id: number;
	caption: string;
	captionBackground: number;
	visibility: 'PUBLIC' | 'FRIEND' | 'PRIVATE';
	publishedAt: string;
	totalViews: number;
	totalReactions: number;
	topReactionTypes: string[];
	totalComments: number;
	totalShares: number;
	attachments: AttachmentType[];
	sharedPost: PostType | null;
	sharedAttachment: SharedAttachment | null;
	postAttachmentType: 'MEDIA' | 'POST' | 'ATTACHMENT';
	author: UserInfo;
	reacted: ReactionType | null;
};

export type { PostType };
