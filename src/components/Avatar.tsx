import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { HiUserGroup } from 'react-icons/hi2';
import Menu from './Menu';
import { useRouter } from 'next/navigation';

type Props = {
	redirectByUsername?: string;
	src: string | null
	className: string;
	isGroupAvatar?: boolean;
	controls?: boolean;
	onClose?: () => void;
};

export default function Avatar({ redirectByUsername, src, className, controls = false, isGroupAvatar = false, onClose }: Props) {
	const router = useRouter()
	const menuData = [
		{
			title: 'Xem trang cá nhân',
			action: () => {
				router.push(`/user/${redirectByUsername}`)
				onClose?.()
			}
		},
		{
			title: 'Chặn',
			action: () => { }
		}
	]

	return (
		controls ? (
			<Menu
				data={menuData}
				position='right'
			>
				<div
					className={'flex items-center justify-center rounded-[50%] ' + className}
				>
					{src ? (
						<img
							src={src}
							alt=""
							className="h-full w-full rounded-[50%] object-cover"
						/>
					) : isGroupAvatar ? (
						<HiUserGroup className="h-full w-full text-3xl" />
					) : (
						<FaUserCircle className="h-full w-full text-3xl" />
					)}
				</div>
			</Menu>
		) : (
			<div
				className={'flex items-center justify-center rounded-[50%] ' + className}
			>
				{src ? (
					<img
						src={src}
						alt=""
						className="h-full w-full rounded-[50%] object-cover"
					/>
				) : isGroupAvatar ? (
					<HiUserGroup className="h-full w-full text-3xl" />
				) : (
					<FaUserCircle className="h-full w-full text-3xl" />
				)}
			</div>
		)
	);
}
