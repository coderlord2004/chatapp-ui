import { useState } from 'react';
import CreatePost from './CreatePost';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { PostType } from '@/types/Post';

type Props = {
	openCreatePost: boolean;
	onCloseCreatePost: () => void;
};

export default function CreatePostIcon({
	openCreatePost,
	onCloseCreatePost,
}: Props) {
	const [open, setOpen] = useState(openCreatePost);

	return (
		<div className="">
			<div
				className="cursor-pointer text-3xl text-white hover:text-blue-600"
				onClick={() => setOpen(true)}
			>
				<IoIosAddCircleOutline />
			</div>
			{(openCreatePost || open) && (
				<CreatePost
					onClose={() => {
						setOpen(false);
						onCloseCreatePost();
					}}
				/>
			)}
		</div>
	);
}
