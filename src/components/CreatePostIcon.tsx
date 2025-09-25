import { useState } from 'react';
import CreatePost from './CreatePost';
import { IoIosAddCircleOutline } from 'react-icons/io';

export default function CreatePostIcon() {
	const [open, setOpen] = useState(false);

	return (
		<div>
			<div className="text-3xl" onClick={() => setOpen(true)}>
				<IoIosAddCircleOutline />
			</div>
			{open && <CreatePost onClose={() => setOpen(false)} />}
		</div>
	);
}
