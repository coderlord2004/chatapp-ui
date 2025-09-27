'use client';

import { useState, useEffect } from 'react';
import ChatRoom from '@/components/ChatRoom';
import { ChatRoomInfo } from '@/types/ChatRoom';
import { SideBar } from '@/components/SideBar';
import { useIncomingCallInvitation } from '@/hooks/useCallService';
import CallAlert from '@/components/CallAlert';
import Slideshow from '@/components/Slideshow';
import { useSearchParams } from 'next/navigation';
import { useRequest } from '@/hooks/useRequest';
import { useAuth } from '@/contexts/AuthContext';

export default function Page() {
	const searchParams = useSearchParams();
	const username = searchParams.get('username');

	const [chatRoomActive, setChatRoomActive] = useState<ChatRoomInfo | null>(
		null,
	);
	const [isOpenSidebar, setOpenSidebar] = useState<boolean>(true);
	const { authUser } = useAuth();
	const toggleSidebar = () => {
		setOpenSidebar(!isOpenSidebar);
	};
	const { callModal, onClose } = useIncomingCallInvitation();
	const { get } = useRequest();

	useEffect(() => {
		const getChatRoomWithMessages = async () => {
			const data = await get('chatroom/get/', {
				params: { username },
			});
			setChatRoomActive(data);
		};
		if (username && authUser?.username !== username) {
			getChatRoomWithMessages();
		}
	}, [username]);

	return (
		<div className="relative flex h-screen overflow-hidden dark:bg-gray-900 dark:text-gray-100">
			<SideBar
				isOpenSidebar={isOpenSidebar}
				onOpenSidebar={toggleSidebar}
				chatRoomActive={chatRoomActive}
				onUpdateChatRoomActive={(activeValue) => {
					setChatRoomActive(activeValue);
					setOpenSidebar(false);
				}}
			/>

			{chatRoomActive ? (
				<ChatRoom
					chatRoomInfo={chatRoomActive}
					isOpenSidebar={isOpenSidebar}
					onOpenSidebar={toggleSidebar}
				/>
			) : (
				<div className="hidden flex-1 items-center justify-center bg-gray-900 sm:flex">
					<Slideshow
						autoPlay={true}
						interval={4000}
						showControls={true}
						showIndicators={true}
					/>
				</div>
			)}

			{callModal && (
				<CallAlert callInvitation={callModal.data} onClose={onClose} />
			)}
		</div>
	);
}
