'use client';

import { useState } from 'react';
import ChatRoom from '@/components/ChatRoom';
import { ChatRoomInfo } from '@/types/ChatRoom';
import { SideBar } from '@/components/SideBar';
import { useJwtDecoded } from '@/contexts/AuthContext';
import { useIncomingCallInvitation } from '@/hooks/useCallService';
import CallAlert from '@/components/CallAlert';
import Slideshow from '@/components/Slideshow';

const slides = [
	{
		id: 1,
		title: 'Nhắn tin tức thì với công nghệ WebSocket',
		src: '/fast.jpg',
	},
	{
		id: 2,
		title: 'Mã hóa end-to-end cho tin nhắn',
		src: '/secure.jpg',
	},
];

export default function Page() {
	const [chatRoomActive, setChatRoomActive] = useState<ChatRoomInfo | null>(
		null,
	);
	const jwt = useJwtDecoded();
	const [isOpenSidebar, setOpenSidebar] = useState<boolean>(true);
	const authUsername = jwt?.sub;
	const toggleSidebar = () => {
		setOpenSidebar(!isOpenSidebar);
	};
	const { callModal, onClose } = useIncomingCallInvitation();

	return (
		<div className="relative flex h-screen overflow-hidden bg-gray-900 text-gray-100">
			<SideBar
				isOpenSidebar={isOpenSidebar}
				onOpenSidebar={toggleSidebar}
				authUsername={authUsername}
				chatRoomActive={chatRoomActive}
				onUpdateChatRoomActive={(activeValue) => {
					setChatRoomActive(activeValue);
					setOpenSidebar(false);
				}}
			/>

			{chatRoomActive ? (
				<ChatRoom
					authUsername={authUsername}
					chatRoomInfo={chatRoomActive}
					isOpenSidebar={isOpenSidebar}
					onOpenSidebar={toggleSidebar}
				/>
			) : (
				<div className="hidden flex-1 items-center justify-center bg-gray-900 sm:flex">
					<Slideshow
						slides={slides}
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
