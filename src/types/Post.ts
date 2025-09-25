import { AttachmentType } from './Attachment';

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
	attachments: AttachmentType;
	sharedPost: PostType;
	postAttachmentType: 'MEDIA' | 'POST';
};

export type { PostType };
