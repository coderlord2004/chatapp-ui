import { useState } from 'react';
import CreatePost from './CreatePost';
import { IoIosAddCircleOutline } from 'react-icons/io';

type Props = {
	openCreatePost: boolean;
	onCloseCreatePost: () => void;
};

export default function CreatePostIcon({ openCreatePost, onCloseCreatePost }: Props) {
	const [open, setOpen] = useState(openCreatePost);

	return (
		<div className=''>
			<div className="cursor-pointer hover:text-blue-600 text-3xl text-white" onClick={() => setOpen(true)}>
				<IoIosAddCircleOutline />
			</div>
			{(openCreatePost || open) &&
				<CreatePost
					onClose={() => {
						setOpen(false);
						onCloseCreatePost();
					}}
				/>
			}
		</div>
	);
}
