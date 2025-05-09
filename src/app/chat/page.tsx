'use client';

import { useState, useEffect } from 'react';
import { useRequest } from '@/hooks/useRequest';
import ChatRoom from '@/components/ChatRoom';
import { FaUserCircle } from 'react-icons/fa';
import { FaComment } from 'react-icons/fa';
import { FaUserFriends } from 'react-icons/fa';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { useJwtDecoded } from '@/contexts/AuthContext';

type ChatRoomInfo = {
	id: number;
	name: string;
	avatar: undefined | string | Blob;
	membersUsername: [];
	type: 'GROUP' | 'DUO';
	createdOn: Date;
};

type Invitation = {
	id: number;
	sender: string;
	receiver: string;
	chatRoomId: number | null;
	status: 'PENDING' | 'REJECTED' | 'ACCEPTED';
};

export default function Page() {
	const { get, post } = useRequest();
	const [chatRooms, setChatRooms] = useState<ChatRoomInfo[]>([]);
	const [chatRoomActive, setChatRoomActive] = useState<ChatRoomInfo | null>(
		null,
	);
	const [invitations, setInvitation] = useState<Invitation[] | null>(null);
	const [isShowInvitations, setShowInvitations] = useState<boolean>(false);

	useEffect(() => {
		const getChatRoom = async () => {
			const results = await Promise.all([
				get('chatrooms/'),
				get('invitations/'),
			]);
			setChatRooms(results[0]);
			setInvitation(results[1]);
		};
		getChatRoom();
	}, [get]);

	const jwt = useJwtDecoded();
	const currentUsername = jwt?.sub;

	function getChatRoomName(info: ChatRoomInfo) {
		const { membersUsername, name } = info;
		if (name) {
			return name;
		}

		return membersUsername
			.filter((username) => username !== currentUsername)
			.join(', ');
	}

	const sendInvitation = async (receiverName: string, chatGroupId = null) => {
		await post('invitations/', {
			receiverUserName: receiverName,
			chatGroupId: chatGroupId,
		});
	};

	return (
		<div className="flex h-screen bg-gray-900 text-gray-100">
			{/* Sidebar */}
			<div className="z-10 flex w-64 min-w-[16rem] flex-col border-r border-gray-700 bg-gray-800">
				<div className="flex items-center justify-between border-b border-gray-700 p-4">
					<h2 className="gradientColor">Chat Rooms</h2>
					<div className="flex items-center justify-center gap-[14px]">
						<div className="relative transition-all duration-200 hover:scale-[1.05] hover:transform hover:text-yellow-400">
							<div
								className="relative"
								onClick={() => setShowInvitations(!isShowInvitations)}
							>
								{invitations && invitations.length && (
									<div className="absolute top-[-70%] right-[-70%] flex h-[20px] w-[20px] items-center justify-center rounded-[50%] bg-red-500 text-[80%]">
										{invitations.length}
									</div>
								)}
								<FaUserFriends
									style={{
										fontSize: '120%',
										cursor: 'pointer',
									}}
								/>
							</div>

							{isShowInvitations && (
								<div className="absolute top-[100%] left-1/2 flex translate-x-[-50%] transform flex-col gap-[5px] rounded-[8px] border-gray-500 bg-gray-700 p-4">
									{invitations ? (
										invitations.map((invitation) => (
											<div
												key={invitation.id}
												className="min-w-[200px] rounded-[5px] bg-gray-900 p-[5px] text-white"
											>
												{invitation.sender}
											</div>
										))
									) : (
										<div>No invitations.</div>
									)}
								</div>
							)}
						</div>
						<div className="transition-all duration-200 hover:scale-[1.05] hover:transform hover:text-yellow-400">
							<IoIosAddCircleOutline
								style={{
									fontSize: '130%',
									cursor: 'pointer',
								}}
							/>
						</div>
					</div>
				</div>
				<div className="flex-1 overflow-y-auto">
					{chatRooms.length ? (
						chatRooms.map((chatRoom) => (
							<div
								key={chatRoom.id}
								onClick={() => setChatRoomActive(chatRoom)}
								className={`mx-2 my-1 flex cursor-pointer items-center rounded-lg p-3 transition-all duration-200 ${
									chatRoom === chatRoomActive
										? 'bg-indigo-600'
										: 'hover:bg-gray-700'
								}`}
							>
								{chatRoom.avatar ? (
									<img
										src={chatRoom.avatar}
										alt=""
										className="h-8 w-8 rounded-full object-cover"
									/>
								) : (
									<FaUserCircle className="h-8 w-8 text-gray-400" />
								)}
								<div className="ml-3 overflow-hidden">
									<p className="truncate font-medium">
										{getChatRoomName(chatRoom)}
									</p>
									{chatRoom.type === 'DUO' && (
										<p className="text-xs text-gray-400">
											{chatRoom.membersUsername.length} members
										</p>
									)}
								</div>
							</div>
						))
					) : (
						<div className="p-4 text-center text-gray-400">
							No chat rooms available
						</div>
					)}
				</div>
			</div>

			{chatRoomActive ? (
				<ChatRoom chatRoomInfo={chatRoomActive} />
			) : (
				<div className="flex flex-1 items-center justify-center bg-gray-900">
					<div className="max-w-md p-6 text-center">
						<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800">
							<FaComment className="text-2xl text-gray-500" />
						</div>
						<h3 className="mb-2 text-xl font-medium">Select a chat</h3>
						<p className="text-gray-400">
							Choose a conversation from the sidebar to start messaging
							<span className="cursor-pointer pl-[4px] text-xl font-bold hover:underline">
								or add more friend.
							</span>
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
