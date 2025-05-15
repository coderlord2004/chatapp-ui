'use client';

import { useState, useEffect } from 'react';
import { useRequest } from '@/hooks/useRequest';
import ChatRoom from '@/components/ChatRoom';
import { FaUserCircle } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";

type ChatRoomInfo = {
	id: number,
	name: string,
	avatar: undefined | string | Blob,
	membersUsername: [],
	type: 'GROUP' | 'DUO',
	createdOn: Date
}

type Invitation = {
	id: number,
	sender: string,
	receiver: string,
	chatRoomId: number | null,
	status: 'PENDING' | 'REJECTED' | 'ACCEPTED'
}

export default function Page() {
	const { get, post } = useRequest()
	const [chatRooms, setChatRooms] = useState<ChatRoomInfo[]>([])
	const [chatRoomActive, setChatRoomActive] = useState<ChatRoomInfo | null>(null)
	const [invitations, setInvitation] = useState<Invitation[] | null>(null)
	const [isShowInvitations, setShowInvitations] = useState<boolean>(false)

	useEffect(() => {
		const getChatRoom = async () => {
			const results = await Promise.all([
				get('chatrooms/'),
				get('invitations/')
			])
			setChatRooms(results[0])
			setInvitation(results[1])
		}
		getChatRoom()
	}, [])

	const sendInvitation = async (receiverName: string, chatGroupId = null) => {
		await post('invitations/', {
			receiverUserName: receiverName,
			chatGroupId: chatGroupId
		})
	}

	return (
		<div className="flex h-screen bg-gray-900 text-gray-100">
			{/* Sidebar */}
			<div className="w-64 min-w-[16rem] bg-gray-800 border-r border-gray-700 flex flex-col z-10 overflow-x-auto resize-x">
				<div className="p-4 border-b border-gray-700 flex justify-between items-center">
					<h2 className="gradientColor">Chat Rooms</h2>
					<div className='flex gap-[14px] justify-center items-center'>
						<div
							className='hover:text-yellow-400 hover:transform hover:scale-[1.05] transition-all duration-200 relative'
						>
							<div
								className='relative'
								onClick={() => setShowInvitations(!isShowInvitations)}
							>
								{invitations && invitations.length && (
									<div className='w-[20px] h-[20px] rounded-[50%] bg-red-500 absolute right-[-70%] top-[-70%] text-center text-[80%]'>
										{invitations.length}
									</div>
								)}
								<FaUserFriends style={{
									fontSize: '120%',
									cursor: 'pointer'
								}} />
							</div>

							{isShowInvitations && (
								<div className='absolute top-[100%] left-1/2 transform translate-x-[-50%] bg-gray-700 rounded-[8px] border-gray-500 p-4 flex flex-col gap-[5px]'>
									{invitations ? invitations.map((invitation) => (
										<div
											key={invitation.id}
											className='min-w-[200px] bg-gray-900 rounded-[5px] text-white p-[5px]'
										>
											{invitation.sender}
										</div>
									)) : (
										<div>No invitations.</div>
									)}
								</div>
							)}
						</div>
						<div className='hover:text-yellow-400 hover:transform hover:scale-[1.05] transition-all duration-200'>
							<IoIosAddCircleOutline style={{
								fontSize: '130%',
								cursor: 'pointer'
							}} />
						</div>
					</div>
				</div>



				<div className="flex-1 overflow-y-auto">
					{chatRooms.length ? (
						chatRooms.map((chatRoom) => (
							<div
								key={chatRoom.id}
								onClick={() => setChatRoomActive(chatRoom)}
								className={`flex items-center p-3 mx-2 my-1 rounded-lg cursor-pointer transition-all duration-200 ${chatRoom === chatRoomActive
									? "bg-indigo-600"
									: "hover:bg-gray-700"
									}`}
							>
								{chatRoom.avatar ? (
									<img
										src={chatRoom.avatar}
										alt=""
										className="w-8 h-8 rounded-full object-cover"
									/>
								) : (
									<FaUserCircle className="w-8 h-8 text-gray-400" />
								)}
								<div className="ml-3 overflow-hidden">
									<p className="font-medium truncate">{chatRoom.name}</p>
									{chatRoom.type === 'DUO' && (
										<p className="text-xs text-gray-400">
											{chatRoom.membersUsername.length} members
										</p>
									)}
								</div>
							</div>
						))
					) : (
						<div className="p-4 text-gray-400 text-center">
							No chat rooms available
						</div>
					)}
				</div>
			</div>

			{chatRoomActive ? (
				<ChatRoom chatRoomInfo={chatRoomActive} />
			) : (
				<div className="flex-1 flex items-center justify-center bg-gray-900">
					<div className="text-center p-6 max-w-md">
						<div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
							<FaComment className="text-2xl text-gray-500" />
						</div>
						<h3 className="text-xl font-medium mb-2">Select a chat</h3>
						<p className="text-gray-400">
							Choose a conversation from the sidebar to start messaging
							<span
								className='text-xl cursor-pointer pl-[4px] font-bold hover:underline'
							>
								or add more friend.
							</span>
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
