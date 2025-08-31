import React, { useState } from 'react';
import { MdGroupAdd } from 'react-icons/md';
import CreateChatRoom from './CreateChatRoom';

type Props = {};

export default function CreateChatRoomIcon({}: Props) {
	const [isOpenCreateChatRoom, setIsOpenCreateChatRoom] =
		useState<boolean>(false);

	return (
		<div>
			<div
				className="cursor-pointer"
				onClick={() => setIsOpenCreateChatRoom(true)}
			>
				<MdGroupAdd />
			</div>

			{isOpenCreateChatRoom && (
				<CreateChatRoom onClose={() => setIsOpenCreateChatRoom(false)} />
			)}
		</div>
	);
}
