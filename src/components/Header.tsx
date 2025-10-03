import Link from 'next/link';
import Avatar from './Avatar';
import TextInput from '@/components/TextInput';
import { useAuth } from '@/contexts/AuthContext';
import CreatePostIcon from './CreatePostIcon';
import { routes } from '@/lib/routes';
import { useState } from 'react';

type Props = {
	className: string;
	onFocusInput?: () => void;
};

export default function Header({ className, onFocusInput }: Props) {
	const { authUser } = useAuth();
	const [openCreatePost, setOpenCreatePost] = useState(false);

	return (
		<header
			className={
				className +
				' fixed top-0 right-0 left-0 flex items-center rounded-b-[10px] bg-black py-[5px] px-[10px] z-50'
			}
		>
			<Link
				href={routes.nextvibes}
				className='ml-[5%] cursor-pointer'
			>
				<img
					src="./logo.jpeg"
					alt=""
					className="w-[50px] h-[50px] rounded-[50%] border-[1px] border-solid border-white"
				/>
			</Link>
			<div className="mx-auto flex w-[50%] h-full items-center justify-evenly">
				<Link href="/" className="group relative cursor-pointer text-white">
					Home
					<span className="absolute bottom-[-2px] left-0 h-[2px] w-0 bg-blue-600 transition-all duration-100 group-hover:w-full"></span>
				</Link>
				<div className="h-full flex items-center justify-center gap-[10px]">
					<Avatar
						author={authUser?.username || ''}
						src={authUser?.avatar || ''}
						className="h-10 w-10"
						controls={true}
					/>
					<TextInput
						placeHolder="Bạn đang nghĩ gì?" className=""
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
			</div>
		</header>
	);
}
