'use client';

import { useState, useEffect } from 'react';
import { useRequest } from '@/hooks/useRequest';
import ChatRoom from '@/components/ChatRoom';
import { FaUserCircle } from "react-icons/fa";
import { FaComment } from "react-icons/fa";

type ChatRoomInfo = {
	id: number,
	name: string,
	avatar: undefined | string | Blob,
	membersUsername: [],
	type: 'GROUP' | 'DUO',
	createdOn: Date
}

export default function Page() {
	const { get } = useRequest()
	const [chatRooms, setChatRooms] = useState<ChatRoomInfo[]>([])
	const [chatRoomActive, setChatRoomActive] = useState<ChatRoomInfo | null>(null)

	useEffect(() => {
		const getChatRoom = async () => {
			const result = await get('chatrooms/')
			console.log(result)
			setChatRooms(result)
			setChatRoomActive(result[0])
		}
		getChatRoom()
	}, [])

	return (
		<div className="flex h-screen bg-gray-900 text-gray-100">
			{/* Sidebar */}
			<div className="w-64 min-w-[16rem] bg-gray-800 border-r border-gray-700 flex flex-col">
				<div className="p-4 border-b border-gray-700">
					<h2 className="gradientColor">Chat Rooms</h2>
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
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
