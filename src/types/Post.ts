import { AttachmentType } from './Attachment';
import { UserInfo } from './User';
import { ReactionType } from './Reaction';

type PostType = {
	id: number;
	caption: string;
	captionBackground: number;
	visibility: 'PUBLIC' | 'FRIEND' | 'PRIVATE';
	publishedAt: string;
	totalReactions: number;
	topReactionTypes: string[];
	totalComments: number;
	totalShares: number;
	attachments: AttachmentType[];
	sharedPost: PostType | null;
	postAttachmentType: 'MEDIA' | 'POST';
	author: UserInfo;
	reacted: ReactionType | null;
};

export type { PostType };
