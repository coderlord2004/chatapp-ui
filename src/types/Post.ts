import { AttachmentType } from './Attachment';
import { UserInfo } from './User';

type PostType = {
	id: number;
	caption: string;
	captionBackground: number;
	visibility: 'PUBLIC' | 'FRIEND' | 'PRIVATE';
	createdOn: string;
	totalReactions: number;
	topReactionTypes: string[];
	totalComments: number;
	totalShares: number;
	attachments: AttachmentType[];
	sharedPost: PostType | null;
	postAttachmentType: 'MEDIA' | 'POST';
	author: UserInfo;
};

export type { PostType };
