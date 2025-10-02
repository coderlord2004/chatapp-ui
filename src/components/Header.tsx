import Link from 'next/link';
import Avatar from './Avatar';
import TextInput from '@/components/TextInput';
import { useAuth } from '@/contexts/AuthContext';
import CreatePostIcon from './CreatePostIcon';

type Props = {
	className: string;
};

export default function Header({ className }: Props) {
	const { authUser } = useAuth();

	return (
		<header
			className={
				className +
				' fixed top-0 right-0 left-0 flex items-center rounded-[10px] bg-black/50 p-[5px] px-[10px]'
			}
		>
			<img
				src="./logo.jpeg"
				alt=""
				className="ml-[5%] h-full w-auto rounded-[50%] border-[1px] border-solid border-white"
			/>
			<div className="mx-auto flex w-[50%] items-center justify-evenly">
				<Link href="/" className="group relative cursor-pointer text-white">
					Home
					<span className="absolute bottom-[-2px] left-0 h-[2px] w-0 bg-blue-600 transition-all duration-100 group-hover:w-full"></span>
				</Link>
				<div className="flex items-center justify-center gap-[10px]">
					<Avatar
						author={authUser?.username || ''}
						src={authUser?.avatar || ''}
						className="h-full"
						controls={true}
					/>
					<TextInput placeHolder="Bạn đang nghĩ gì?" className="" />
					<CreatePostIcon />
				</div>
			</div>
		</header>
	);
}
