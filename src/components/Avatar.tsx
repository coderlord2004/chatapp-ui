import React from 'react';
import { FaUser } from 'react-icons/fa';

type Props = {
	src: string | Blob | undefined;
	className: string;
};

export default function Avatar({ src, className }: Props) {
	return (
		<div className={'' + className}>
			{src ? (
				<img
					src={src}
					alt=""
					className="h-full w-full rounded-[50%] object-cover"
				/>
			) : (
				<FaUser className="text-3xl" />
			)}
		</div>
	);
}
