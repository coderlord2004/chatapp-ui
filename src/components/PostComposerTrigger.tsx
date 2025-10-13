import { useState } from 'react';
import TextInput from './TextInput';
import CreatePostIcon from './CreatePostIcon';
import { useAuth } from '@/contexts/AuthContext';

type Props = {};

export default function PostComposerTrigger({}: Props) {
	const [openCreatePost, setOpenCreatePost] = useState(false);
	return (
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
	);
}
