import React, { useState, useEffect } from 'react';

import { useSearchUser } from '@/hooks/useSearchUser';
import { useAuth } from '@/contexts/AuthContext';
import Invitations from './Invitations';
import CreateChatRoomIcon from './CreateChatRoomIcon';
import { ChatRoomInfo } from '@/types/ChatRoom';
import Link from 'next/link';
import Avatar from './Avatar';

import { FaPowerOff } from 'react-icons/fa';
import { IoMdSettings, IoIosAddCircleOutline } from 'react-icons/io';

type Props = {
	authUsername: string | undefined;
	onUpdateChatRoom: (newChatRoom: ChatRoomInfo) => void;
};

export default function SideBarHeader({
	authUsername,
	onUpdateChatRoom,
}: Props) {
	const { setSearchUserModal } = useSearchUser();
	const { authUser, logout } = useAuth();
	const [isShowSetting, setShowSetting] = useState<boolean>(false);

	return (
		<div className="z-[1000] flex items-center justify-between border-b border-gray-700 p-4">
			<Link href="/" className="gradientColor">
				NextChat
			</Link>
			<div className="flex items-center justify-center gap-[14px]">
				<Invitations onUpdateChatRooms={onUpdateChatRoom} />

				<div
					className="transition-all duration-200 hover:scale-[1.05] hover:transform hover:text-yellow-400"
					onClick={() =>
						setSearchUserModal({
							isOpen: true,
							chatGroupId: null,
						})
					}
				>
					<IoIosAddCircleOutline
						style={{
							fontSize: '130%',
							cursor: 'pointer',
						}}
					/>
				</div>

				<CreateChatRoomIcon />

				<div className="relative flex items-center justify-center">
					<div onClick={() => setShowSetting(!isShowSetting)}>
						<IoMdSettings className="cursor-pointer text-[120%] hover:transform hover:text-yellow-400" />
					</div>

					{isShowSetting && (
						<div className="absolute top-[120%] right-0 flex transform cursor-pointer flex-col gap-[10px] rounded-[8px] bg-slate-600 p-[10px] sm:right-1/2 sm:translate-x-[50%]">
							<div className="flex items-center justify-center gap-[10px]">
								<Avatar
									redirectByUsername={authUser?.username || ''}
									src={authUser?.avatar || ''}
									controls={true}
									className="h-10 w-10"
								/>
								<div className="whitespace-nowrap">me: {authUsername}</div>
							</div>
							<div
								className="flex items-center justify-center gap-[7px] p-[5px] transition-all duration-200 hover:transform hover:bg-slate-500 hover:text-red-700"
								onClick={() => logout()}
							>
								<p className="whitespace-nowrap">Log out</p>
								<FaPowerOff className="text-[120%]" title="logout" />
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
