import React, { useState } from 'react';
import CreateChatRoom from './CreateChatRoom';
import { MdGroupAdd } from 'react-icons/md';

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
