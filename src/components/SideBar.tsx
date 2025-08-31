import React, { useState, useEffect, useRef } from 'react';
import { useRequest } from '@/hooks/useRequest';
import { useInvitationReply } from '@/hooks/useInvitations';
import { ChatRoomInfo, MessageResponseType } from '@/types/types';
import { formatDateTime } from '@/utils/formatDateTime';
import SideBarHeader from './SideBarHeader';
import useCreateChatRoomInvitation from '@/hooks/useCreateChatRoomInvitation';
import useGlobalMessages from '@/hooks/useGlobalMessages';
import Avatar from './Avatar';
import { ChatRoomsContext } from '@/hooks/useChatRooms';
import { useNotification } from '@/hooks/useNotification';

type SideBarProps = {
	isOpenSidebar: boolean;
	onOpenSidebar: () => void;
	authUsername: string | undefined;
	chatRoomActive: ChatRoomInfo | null;
	onUpdateChatRoomActive: (activeValue: ChatRoomInfo) => void;
};

export function SideBar(props: SideBarProps) {
	const { get } = useRequest();
	const [chatRooms, setChatRooms] = useState<ChatRoomInfo[]>([]);
	const sideBarRef = useRef<HTMLDivElement>(null);
	const invitationReply = useInvitationReply();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const globalMessage = useGlobalMessages();
	const { createChatRoomInvitation } = useCreateChatRoomInvitation();
	const { showNotification } = useNotification()

	function getChatRoomName(info: ChatRoomInfo) {
		const { membersUsername, name } = info;
		if (name) {
			return name;
		}
		return membersUsername
			.filter((username) => username !== props.authUsername)
			.slice(0, 3)
			.join(', ');
	}

	function getDocumentTitle(chatMessage: MessageResponseType) {
		return chatMessage.message
			? `${chatMessage.sender} đã gửi cho bạn 1 tin nhắn.`
			: `${chatMessage.sender} đã gửi cho bạn 1 tệp tin.`;
	}

	function updateDocumentTitle() {
		if (typeof document === 'undefined') return;
		if (globalMessage!.message.sender === props.authUsername) return undefined;

		let count = 1;
		const intervalId = setInterval(() => {
			console.log('count:', count);

			if (count % 2 === 0) {
				document.title = getDocumentTitle(globalMessage!.message);
			} else {
				document.title = '';
			}
			count++;
		}, 1500);
		return intervalId;
	}

	function updateLatestChatRoom(chatRoom: ChatRoomInfo) {
		setChatRooms((prev) => [chatRoom, ...prev]);
	}

	useEffect(() => {
		if (createChatRoomInvitation) {
			showNotification({
				type: 'info',
				message: `${createChatRoomInvitation.sender} đã gửi cho bạn lời mời vào nhóm.`
			})
			updateLatestChatRoom(createChatRoomInvitation.chatRoom)
		}
	}, [createChatRoomInvitation])

	useEffect(() => {
		if (!globalMessage) return;

		const intervalId = updateDocumentTitle();

		setChatRooms((prev) => {
			const latestChatRoom = prev.find(
				(chatRoom) => chatRoom.id === globalMessage.roomId,
			);
			const newChatRooms = prev.filter(
				(chatRoom) => chatRoom.id !== latestChatRoom?.id,
			);
			return latestChatRoom ? [latestChatRoom, ...newChatRooms] : prev;
		});

		return () => {
			clearInterval(intervalId);
		};
	}, [globalMessage]);

	useEffect(() => {
		const getChatRoom = async () => {
			const results = await get('chatrooms/get/');
			setIsLoading(false);
			setChatRooms(results);
		};
		getChatRoom();
	}, [get]);

	useEffect(() => {
		if (invitationReply) {
			const newChatRoom: ChatRoomInfo = {
				id: invitationReply.chatRoomDto.id,
				name: null,
				avatar: invitationReply.sender.avatar,
				membersUsername: [
					invitationReply.sender.username,
					invitationReply.receiver.username,
				],
				type: 'DUO',
				createdOn: Date.now().toString(),
				latestMessage: null,
			};
			setChatRooms((prev) => [newChatRoom, ...prev]);
		}
	}, [invitationReply]);

	return (
		<ChatRoomsContext.Provider value={{ chatRooms, updateLatestChatRoom }}>
			<div
				ref={sideBarRef}
				className={`sidebar ${props.isOpenSidebar ? 'w-full sm:w-auto' : 'w-0'} relative flex h-full flex-col justify-between border-r border-gray-700 bg-gray-800 sm:max-w-[300px] sm:min-w-[230px] md:w-[500px]`}
			>
				<SideBarHeader
					authUsername={props.authUsername}
					onUpdateChatRoom={(newChatRoom) =>
						setChatRooms((prev) => [newChatRoom, ...prev])
					}
				/>

				<div className="scrollBarStyle flex flex-1 flex-col overflow-y-auto">
					{isLoading ? (
						Array.from({ length: 6 }).map((_, index) => (
							<div
								key={index}
								className="mx-2 my-1 flex animate-pulse items-center rounded-lg bg-gray-700 p-3"
							>
								<div className="h-8 w-8 rounded-full bg-gray-600"></div>
								<div className="ml-3 flex-1 space-y-2">
									<div className="h-4 w-[60%] bg-gray-600"></div>
									<div className="h-3 w-[80%] bg-gray-600"></div>
								</div>
							</div>
						))
					) : chatRooms.length ? (
						chatRooms.map((chatRoom) => (
							<div
								key={chatRoom.id}
								onClick={() => props.onUpdateChatRoomActive(chatRoom)}
								className={`mx-2 my-1 flex cursor-pointer items-center rounded-lg p-3 transition-all duration-200 ${chatRoom === props.chatRoomActive
									? 'bg-indigo-600'
									: 'hover:bg-gray-700'
									}`}
							>
								<Avatar
									src={chatRoom.avatar}
									className="h-10 w-10"
									isGroupAvatar={chatRoom.type === 'GROUP'}
								/>
								<div className="ml-3 overflow-hidden">
									<p className="truncate font-medium">
										{getChatRoomName(chatRoom)}
									</p>

									{chatRoom.latestMessage && (
										<div className="flex items-center justify-between gap-[5px] text-[80%] text-gray-400">
											<div className="truncate">
												<b>
													{props.authUsername
														? 'Bạn'
														: chatRoom.latestMessage.sender}
													:
												</b>{' '}
												{chatRoom.latestMessage.attachments?.length
													? 'Đã gửi 1 ảnh'
													: chatRoom.latestMessage.message}
											</div>
											<div className="">
												{formatDateTime(chatRoom.latestMessage.sentOn)}
											</div>
										</div>
									)}

									{chatRoom.type === 'GROUP' && (
										<p className="text-xs text-gray-400">
											{chatRoom.membersUsername.length} members
										</p>
									)}
								</div>
							</div>
						))
					) : (
						<div className="p-4 text-center text-gray-400">
							Chưa có bạn bè nào.
						</div>
					)}
				</div>
			</div>
		</ChatRoomsContext.Provider>
	);
}
