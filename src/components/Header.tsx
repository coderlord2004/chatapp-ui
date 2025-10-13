import Link from 'next/link';
import Avatar from './Avatar';
import TextInput from '@/components/TextInput';
import { useAuth } from '@/contexts/AuthContext';
import CreatePostIcon from './CreatePostIcon';
import { routes } from '@/lib/routes';
import { useState } from 'react';
import NotificationIcon from './NotificationIcon';
import PostComposerTrigger from './PostComposerTrigger';

type Props = {
	className: string;
	onFocusInput?: () => void;
};

export default function Header({ className, onFocusInput }: Props) {
	const { authUser } = useAuth();

	return (
		<header
			className={
				className +
				' fixed top-0 right-0 left-0 z-50 flex items-center rounded-b-[10px] bg-black px-[10px] py-[5px]'
			}
		>
			<Link href={routes.nextvibes} className="ml-[5%] cursor-pointer">
				<img
					src="./logo.jpeg"
					alt=""
					className="h-[50px] w-[50px] rounded-[50%] border-[1px] border-solid border-white"
				/>
			</Link>
			<div className="mx-auto flex h-full w-[50%] items-center justify-evenly">
				<Link href="/" className="group relative cursor-pointer text-white">
					Home
					<span className="absolute bottom-[-2px] left-0 h-[2px] w-0 bg-blue-600 transition-all duration-100 group-hover:w-full"></span>
				</Link>
				<div className="flex h-full items-center justify-center gap-[10px]">
					<Avatar
						author={authUser?.username || ''}
						src={authUser?.avatar || ''}
						className="h-10 w-10"
						controls={true}
					/>
					<PostComposerTrigger />
				</div>
			</div>

			<NotificationIcon />
		</header>
	);
}
