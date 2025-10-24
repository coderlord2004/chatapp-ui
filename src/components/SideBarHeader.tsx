'use client';

import React, { useState, useEffect } from 'react';

import { useSearchUser } from '@/hooks/useSearchUser';
import { useAuth } from '@/contexts/AuthContext';
import Invitations from './Invitations';
import CreateChatRoomIcon from './CreateChatRoomIcon';
import { ChatRoomInfo } from '@/types/ChatRoom';
import Link from 'next/link';
import Avatar from './Avatar';
import Menu from './Menu';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/routes';

import { FaPowerOff } from 'react-icons/fa';
import { IoMdSettings, IoIosAddCircleOutline } from 'react-icons/io';

type Props = {};

export default function SideBarHeader({}: Props) {
	const { setSearchUserModal } = useSearchUser();
	const { authUser, logout } = useAuth();
	const router = useRouter();

	const settingMenu = [
		{
			title: 'Trang cá nhân',
			accepted: true,
			icon: (
				<Avatar
					author={authUser?.username || ''}
					src={authUser?.avatar || ''}
					controls
					className="h-10 w-10"
				/>
			),
			action: () => {
				router.push(routes.profile(authUser?.username || ''));
			},
		},
		{
			title: 'Cài đặt',
			accepted: true,
			action: () => {},
		},
		{
			title: 'logout',
			accepted: true,
			icon: <FaPowerOff className="text-[120%]" title="logout" />,
			action: () => {
				logout();
			},
		},
	];

	return (
		<div className="z-[1000] flex items-center justify-between border-b border-gray-700 p-4">
			<Link href="/" className="gradientColor">
				NextChat
			</Link>
			<div className="flex items-center justify-center gap-[14px]">
				<Invitations />

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
					<Menu data={settingMenu} position="left">
						<div>
							<IoMdSettings className="cursor-pointer text-[120%] hover:transform hover:text-yellow-400" />
						</div>
					</Menu>
				</div>
			</div>
		</div>
	);
}
