import React, { useState, useEffect, useRef } from 'react';
import { useRequest } from '@/hooks/useRequest';
import { FaUserCircle } from 'react-icons/fa';
import { FaUserFriends } from 'react-icons/fa';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { ChatRoomInfo } from '@/types/types';
import { TiTick } from 'react-icons/ti';
import { IoClose } from 'react-icons/io5';
import { useSearchUser } from '@/hooks/useSearchUser';
import { useInvitations } from '@/hooks/useInvitations';
import { formatDateTime } from '@/utils/formatDateTime';
import { FaPowerOff } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { IoMdSettings } from 'react-icons/io';

type SideBarProps = {
	authUsername: string | undefined;
	chatRoomActive: ChatRoomInfo | null;
	onUpdateChatRoomActive: (activeValue: ChatRoomInfo) => void;
};

export function SideBar(props: SideBarProps) {
	const { get, patch } = useRequest();
	const { invitations, updateInvitationStatus } = useInvitations();
	const [isShowInvitations, setShowInvitations] = useState<boolean>(false);
	const [chatRooms, setChatRooms] = useState<ChatRoomInfo[]>([]);
	const { setSearchUserModal } = useSearchUser();
	const sideBarRef = useRef<HTMLDivElement>(null);
	const { logout } = useAuth();
	const [isShowSetting, setShowSetting] = useState<boolean>(false);

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

	const startResize = (e: React.MouseEvent) => {
		e.preventDefault();
		const box = sideBarRef.current;
		if (!box) return;

		const startX = e.clientX;
		const startWidth = box.offsetWidth;

		const handleMouseMove = (e: MouseEvent) => {
			box.style.width = `${startWidth + (e.clientX - startX)}px`;
		};

		const stopResize = () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', stopResize);
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', stopResize);
	};

	const handleInvitation = async (invitationId: number, isAccept: boolean) => {
		await patch(`invitations/${invitationId}`, {
			accept: isAccept,
		});

		updateInvitationStatus(invitationId, isAccept ? 'ACCEPTED' : 'REJECTED');
		if (!isAccept) {
			return;
		}

		const senderInvitation = invitations.find(
			(invitation) => invitation.id === invitationId,
		);

		setChatRooms((prev) => {
			if (!senderInvitation) {
				return prev;
			}

			const newChatRoom: ChatRoomInfo = {
				id: senderInvitation.chatRoomId,
				name: null,
				avatar: senderInvitation.sender.avatar,
				membersUsername: [
					senderInvitation.sender.username,
					senderInvitation.receiver.username,
				],
				type: 'DUO',
				createdOn: Date.now().toString(),
				latestMessage: null,
			};

			return [newChatRoom, ...prev];
		});
	};

	const getTotalNewInvitations = () => {
		return invitations.filter((i) => i.status === 'PENDING').length;
	};

	const totalNewInvitations = getTotalNewInvitations();

	useEffect(() => {
		const getChatRoom = async () => {
			const results = await get('chatrooms/');
			setChatRooms(results[0]);
		};
		getChatRoom();
	}, [get]);

	return (
		<div
			ref={sideBarRef}
			className="lsm:w-64 relative z-10 flex w-full min-w-[200px] flex-col border-r border-gray-700 bg-gray-800"
		>
			<div className="z-[1000] flex items-center justify-between border-b border-gray-700 p-4">
				<h2 className="gradientColor">NextChat</h2>
				<div className="flex items-center justify-center gap-[14px]">
					<div className="relative">
						<div
							className="relative transition-all duration-200 hover:scale-[1.05] hover:transform hover:text-yellow-400"
							onClick={() => setShowInvitations(!isShowInvitations)}
						>
							{totalNewInvitations !== 0 && (
								<div className="absolute top-[-70%] right-[-70%] flex h-[20px] w-[20px] items-center justify-center rounded-[50%] bg-red-500 text-[80%]">
									{totalNewInvitations}
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
											className="flex min-w-[200px] items-center justify-between rounded-[5px] bg-gray-900 p-[5px] text-white"
										>
											{invitation.sender.avatar ? (
												<img
													src={invitation.sender.avatar}
													alt=""
													className="h-[25px] w-[25px]"
												/>
											) : (
												<FaUserCircle className="text-[25px]" />
											)}
											<p>{invitation.sender.username}</p>
											{invitation.status === 'PENDING' ? (
												<div className="flex items-center justify-center">
													<div
														className="transform cursor-pointer text-[25px] transition-all duration-200 hover:scale-[1.1] hover:text-[lightgreen]"
														onClick={() =>
															handleInvitation(invitation.id, true)
														}
													>
														<TiTick />
													</div>
													<div
														className="cursor-pointer text-[25px] transition-all duration-200 hover:scale-[1.1] hover:transform hover:text-red-600"
														onClick={() =>
															handleInvitation(invitation.id, false)
														}
													>
														<IoClose />
													</div>
												</div>
											) : (
												<div className="flex items-center justify-center rounded-[5px] bg-blue-500 px-[5px] text-xs">
													{invitation.status === 'ACCEPTED' ? (
														<>
															<p>Accepted</p>
															<TiTick className="text-[25px] text-green-500" />
														</>
													) : (
														<>
															<p>Rejected</p>
															<IoClose
																style={{
																	fontSize: '25px',
																	color: 'red',
																}}
															/>
														</>
													)}
												</div>
											)}
										</div>
									))
								) : (
									<div>No invitations.</div>
								)}
							</div>
						)}
					</div>

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

					<div className="relative flex items-center justify-center">
						<div onClick={() => setShowSetting(!isShowSetting)}>
							<IoMdSettings className="cursor-pointer text-[120%] hover:transform hover:text-yellow-400" />
						</div>

						{isShowSetting && (
							<div className="absolute top-[120%] left-1/2 flex translate-x-[-50%] transform cursor-pointer flex-col gap-[10px] rounded-[8px] bg-slate-600 p-[10px]">
								<div>me: {props.authUsername}</div>
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

			<div className="scrollBarStyle flex-1 overflow-y-auto">
				{chatRooms.length ? (
					chatRooms.map((chatRoom) => (
						<div
							key={chatRoom.id}
							onClick={() => props.onUpdateChatRoomActive(chatRoom)}
							className={`mx-2 my-1 flex cursor-pointer items-center rounded-lg p-3 transition-all duration-200 ${
								chatRoom === props.chatRoomActive
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
								<FaUserCircle className="h-8 min-w-8 text-gray-400" />
							)}
							<div className="ml-3 overflow-hidden">
								<p className="truncate font-medium">
									{getChatRoomName(chatRoom)}
								</p>
								{chatRoom.latestMessage && (
									<div className="text-[80%] text-gray-400">
										<p>
											<b>
												{props.authUsername
													? 'Bạn'
													: chatRoom.latestMessage.sender}
												:{' '}
											</b>
											{chatRoom.latestMessage.attachments?.length
												? 'Đã gửi 1 ảnh'
												: chatRoom.latestMessage.message}
										</p>
										<span>.</span>
										{formatDateTime(chatRoom.latestMessage.sentOn)}
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
						No chat rooms available
					</div>
				)}
			</div>

			<div
				onMouseDown={startResize}
				className="lsm:block absolute top-0 right-0 z-[1] hidden h-full w-[2px] cursor-ew-resize bg-slate-600"
			/>
		</div>
	);
}
