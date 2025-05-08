'use client';

import { useState, useEffect } from 'react';
import { useRequest } from '@/hooks/useRequest';
import ChatRoom from '@/components/ChatRoom';
import { FaUserCircle } from "react-icons/fa";

type ChatRoomInfo = {
	id: number,
	name: string,
	avatar: undefined | string | Blob,
	membersUsername: [],
	type: string,
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
		<div className="flex h-screen flex-col p-4 relative">
			<div className='side-bar fixed top-0 left-0 bottom-0 w-[20%] min-w-[200px] bg-black'>
				{chatRooms.length ? chatRooms.map((chatRoom, index) => (
					<div
						key={chatRoom.id}
						onClick={() => setChatRoomActive(chatRoom)}
						style={chatRoom === chatRoomActive ? {
							color: 'green'
						} : {
							color: 'black'
						}}
						className='bg-slate-700 rounded-[5px] flex gap-x-[7px] p-[8px] cursor-pointer'
					>
						{chatRoom.avatar ? (
							<img src={chatRoom.avatar} alt="" />
						) : (
							<div>
								<FaUserCircle style={{
									width: '25px',
									height: '25px'
								}} />
							</div>
						)}

						<p>{chatRoom.name}</p>
					</div>
				)) : (
					<div></div>
				)}
			</div>
			{chatRoomActive && <ChatRoom chatRoomInfo={chatRoomActive} />}
		</div>
	);
}
