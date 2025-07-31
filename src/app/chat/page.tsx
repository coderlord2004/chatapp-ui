'use client';

import { useState } from 'react';
import ChatRoom from '@/components/ChatRoom';
import { FaComment } from 'react-icons/fa';
import { ChatRoomInfo } from '@/types/types';
import { SideBar } from '@/components/SideBar';
import { useJwtDecoded } from '@/contexts/AuthContext';
import { useSearchUser } from '@/hooks/useSearchUser';
import useCallService from "@/hooks/useCallService";
import CallAlert from '@/components/CallAlert';

export default function Page() {
	const [chatRoomActive, setChatRoomActive] = useState<ChatRoomInfo | null>(
		null,
	);
	const jwt = useJwtDecoded();
	const [isOpenSidebar, setOpenSidebar] = useState<boolean>(true);
	const authUsername = jwt?.sub;
	const { setSearchUserModal } = useSearchUser();
	const toggleSidebar = () => {
		setOpenSidebar(!isOpenSidebar);
	};
	const { callModal, onClose } = useCallService()

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
					<div className="max-w-md p-6 text-center">
						<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800">
							<FaComment className="text-2xl text-gray-500" />
						</div>
						<h3 className="mb-2 text-xl font-medium">Select a chat</h3>
						<p className="text-gray-400">
							Choose a conversation from the sidebar to start messaging
							<span
								className="cursor-pointer pl-[4px] text-xl font-bold hover:underline"
								onClick={() =>
									setSearchUserModal({
										isOpen: true,
										chatGroupId: null,
									})
								}
							>
								or add more friend.
							</span>
						</p>
					</div>
				</div>
			)}

			{callModal.isOpen && (
				
			)}
		</div>
	);
}
