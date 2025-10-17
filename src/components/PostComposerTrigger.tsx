import { createContext, useContext, useState } from 'react';
import TextInput from './TextInput';
import CreatePostIcon from './CreatePostIcon';
import { PostType } from '@/types/Post';
import React from 'react';

type PostComposerTrigger = {
	onCreatePost: (data: PostType) => void;
};

const PostComposerTriggerContext = createContext<PostComposerTrigger | null>(
	null,
);

export const useTrigger = () => {
	const context = useContext(PostComposerTriggerContext);
	if (!context) {
		throw new Error('PostComposerTriggerContext can not use outside Provider!');
	}
	return context;
};

export default function PostComposerTrigger({
	onCreatePost,
}: PostComposerTrigger) {
	const [openCreatePost, setOpenCreatePost] = useState(false);
	return (
		<PostComposerTriggerContext.Provider value={{ onCreatePost }}>
			<div className="flex h-full items-center justify-center gap-[10px]">
				<TextInput
					placeHolder="Bạn đang nghĩ gì?"
					className=""
					onFocus={() => {
						setTimeout(() => {
							setOpenCreatePost(true);
						}, 50);
					}}
				/>
				<CreatePostIcon
					openCreatePost={openCreatePost}
					onCloseCreatePost={() => setOpenCreatePost(false)}
				/>
			</div>
		</PostComposerTriggerContext.Provider>
	);
}
