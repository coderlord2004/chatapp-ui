type AttachmentType = {
	id: number;
	name: string;
	source: string;
	type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'RAW' | 'DOCUMENT';
	format: string;
	description: string | null;
};

export type { AttachmentType };
