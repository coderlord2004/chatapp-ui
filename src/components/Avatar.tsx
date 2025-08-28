import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { HiUserGroup } from 'react-icons/hi2';

type Props = {
	src: string | Blob | undefined | null;
	className: string;
	isGroupAvatar?: boolean;
};

export default function Avatar({ src, className, isGroupAvatar }: Props) {
	return (
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
	);
}
