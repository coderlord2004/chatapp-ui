'use client';

import React from 'react';
import { IoMdClose } from 'react-icons/io';
import { IoWarning } from 'react-icons/io5';
import { IoNotifications } from 'react-icons/io5';

type NotificationProps = {
	id: number;
	type: 'success' | 'error' | 'info';
	message: string;
	onClose: (id: number) => void;
};

export default function Notification({
	id,
	type,
	message,
	onClose,
}: NotificationProps) {
	const borderColor =
		type === 'success' ? 'green' : type === 'error' ? 'red' : 'blue';

	return (
		<div
			className="relative flex min-w-[200px] items-center gap-x-[7px] rounded bg-white p-3 text-black shadow"
			style={{
				borderLeft: `5px solid ${borderColor}`,
			}}
		>
			{type === 'error' ? (
				<IoWarning
					style={{
						width: '25px',
						height: '25px',
						color: 'yellow',
					}}
				/>
			) : (
				<IoNotifications
					style={{
						width: '25px',
						height: '25px',
						color: 'green',
					}}
				/>
			)}
			<p className="text-sm">{message}</p>
			<button
				className="absolute top-[0px] right-[0px] h-auto w-auto cursor-pointer"
				onClick={() => onClose(id)}
			>
				<IoMdClose
					style={{
						width: '20px',
						height: '20px',
					}}
				/>
			</button>
		</div>
	);
}
