'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRequest } from '@/hooks/useRequest';
import { useInvitationReply } from '@/hooks/useInvitations';
import { ChatRoomInfo } from '@/types/ChatRoom';
import { MessageResponseType } from '@/types/Message';
import { formatDateTime } from '@/utils/formatDateTime';
import SideBarHeader from './SideBarHeader';
import useCreateChatRoomInvitation from '@/hooks/useCreateChatRoomInvitation';
import useGlobalMessages from '@/hooks/useGlobalMessages';
import Avatar from './Avatar';
import { ChatRoomsContext } from '@/hooks/useChatRooms';
import { useNotification } from '@/hooks/useNotification';
import { useAuth } from '@/contexts/AuthContext';

type SideBarProps = {
	isOpenSidebar: boolean;
	onOpenSidebar: () => void;
	chatRoomActive: ChatRoomInfo | null;
	onUpdateChatRoomActive: (activeValue: ChatRoomInfo) => void;
};

type TabType = 'rooms' | 'pending';

export function SideBar(props: SideBarProps) {
	const { get } = useRequest();
	const { authUser } = useAuth();
	const [chatRooms, setChatRooms] = useState<ChatRoomInfo[]>([]);
	const [pendingRooms, setPendingRooms] = useState<ChatRoomInfo[]>([]);
	const [activeTab, setActiveTab] = useState<TabType>('rooms');
	const sideBarRef = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isLoadingPending, setIsLoadingPending] = useState<boolean>(false);
	const invitationReply = useInvitationReply();
	const globalMessage = useGlobalMessages();
	const { createChatRoomInvitation } = useCreateChatRoomInvitation();
	const { showNotification } = useNotification();

	function getChatRoomName(info: ChatRoomInfo) {
		const { members, name } = info;
		if (name) {
			return name;
		}
		if (info.type === 'DUO' && members.length === 2) {
			return (
				members.find((member) => member.username !== authUser?.username)
					?.username || 'Unknown'
			);
		}
		return members
			.filter((member) => member.username !== authUser?.username)
			.map((member) => member.username)
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
		if (globalMessage!.message.sender === authUser?.username) return undefined;

		let count = 1;
		const intervalId = setInterval(() => {
			if (count % 2 === 0) {
				document.title = getDocumentTitle(globalMessage!.message);
			} else {
				document.title = 'Chat App';
			}
			count++;
		}, 1500);
		return intervalId;
	}

	function createLatestChatRoom(chatRoom: ChatRoomInfo) {
		setChatRooms((prev) => [chatRoom, ...prev]);
	}

	function updateChatRoom(id: number, chatRoom: ChatRoomInfo) {
		setChatRooms((prev) =>
			prev.map((c) => {
				if (c.id === id) return chatRoom;
				else return c;
			}),
		);
	}

	const fetchChatRooms = async () => {
		setIsLoading(true);
		try {
			const results = await get('chatrooms/get/');
			setChatRooms(results);
		} catch (error) {
			console.error('Error fetching chat rooms:', error);
		} finally {
			setIsLoading(false);
		}
	};

	// Fetch pending rooms
	const fetchPendingRooms = async () => {
		setIsLoadingPending(true);
		try {
			const results = await get('chatrooms/waiting/');
			setPendingRooms(results);
		} catch (error) {
			console.error('Error fetching pending rooms:', error);
		} finally {
			setIsLoadingPending(false);
		}
	};

	useEffect(() => {
		if (createChatRoomInvitation) {
			showNotification({
				type: 'info',
				message: `${createChatRoomInvitation.sender} đã gửi cho bạn lời mời vào nhóm.`,
			});
			createLatestChatRoom(createChatRoomInvitation.chatRoom);
		}
	}, [createChatRoomInvitation]);

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
		fetchChatRooms();
	}, [get]);

	useEffect(() => {
		if (activeTab === 'pending') {
			fetchPendingRooms();
		}
	}, [activeTab]);

	useEffect(() => {
		if (invitationReply) {
			const newChatRoom: ChatRoomInfo = {
				id: invitationReply.chatRoomDto.id,
				name: null,
				avatar: invitationReply.sender.avatar,
				members: [invitationReply.sender, invitationReply.receiver],
				type: 'DUO',
				createdOn: Date.now().toString(),
				leader: null,
				leaderOnlySend: false,
				isWaitingRoom: false,
				latestMessage: null,
				firstMessagePage: null,
			};
			setChatRooms((prev) => [newChatRoom, ...prev]);
		}
	}, [invitationReply]);

	const handleChatRoomClick = (chatRoom: ChatRoomInfo) => {
		props.onUpdateChatRoomActive(chatRoom);
	};

	const ChatRoomSkeleton = () => (
		<div className="mx-2 my-1 flex items-center rounded-xl p-3">
			<div className="h-12 w-12 animate-pulse rounded-2xl bg-gradient-to-br from-gray-700 to-gray-600"></div>
			<div className="ml-3 flex-1 space-y-2">
				<div className="h-4 w-32 animate-pulse rounded bg-gradient-to-r from-gray-700 to-gray-600"></div>
				<div className="h-3 w-24 animate-pulse rounded bg-gradient-to-r from-gray-700 to-gray-600"></div>
			</div>
		</div>
	);

	const renderChatRooms = () => {
		if (isLoading) {
			return Array.from({ length: 8 }).map((_, index) => (
				<ChatRoomSkeleton key={index} />
			));
		}

		if (chatRooms.length === 0) {
			return (
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="flex flex-col items-center justify-center px-6 py-12 text-center"
				>
					<div className="mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
						<svg
							className="h-12 w-12 text-purple-400/60"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
							/>
						</svg>
					</div>
					<h3 className="mb-2 text-lg font-semibold text-white">
						Chưa có cuộc trò chuyện nào
					</h3>
					<p className="text-sm text-purple-200/60">
						Bắt đầu trò chuyện với bạn bè ngay bây giờ!
					</p>
				</motion.div>
			);
		}

		return chatRooms.map((chatRoom, index) => (
			<motion.div
				key={chatRoom.id}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: index * 0.1 }}
				onClick={() => handleChatRoomClick(chatRoom)}
				className={`group relative mx-2 my-1 flex cursor-pointer items-center rounded-2xl p-3 transition-all duration-300 ${
					chatRoom.id === props.chatRoomActive?.id
						? 'border border-white/20 bg-gradient-to-r from-purple-600/80 to-pink-600/80 shadow-lg shadow-purple-500/30'
						: 'border border-transparent bg-white/5 hover:border-white/10 hover:bg-white/10'
				}`}
			>
				<Avatar
					author={getChatRoomName(chatRoom)}
					src={chatRoom.avatar}
					className={`h-12 w-12 ring-2 transition-all duration-300 ${
						chatRoom.id === props.chatRoomActive?.id
							? 'ring-white/50'
							: 'ring-purple-500/30 group-hover:ring-purple-500/50'
					}`}
					isGroupAvatar={chatRoom.type === 'GROUP'}
				/>

				<div className="ml-3 flex-1 overflow-hidden">
					<div className="flex items-center justify-between">
						<p
							className={`truncate font-semibold transition-colors ${
								chatRoom.id === props.chatRoomActive?.id
									? 'text-white'
									: 'text-white group-hover:text-purple-100'
							}`}
						>
							{getChatRoomName(chatRoom)}
						</p>
						{chatRoom.latestMessage && (
							<span
								className={`ml-2 flex-shrink-0 text-xs ${
									chatRoom.id === props.chatRoomActive?.id
										? 'text-white/80'
										: 'text-purple-200/60'
								}`}
							>
								{formatDateTime(chatRoom.latestMessage.sentOn)}
							</span>
						)}
					</div>

					{chatRoom.latestMessage && (
						<div className="mt-1 flex items-center justify-between">
							<p
								className={`flex-1 truncate text-sm ${
									chatRoom.id === props.chatRoomActive?.id
										? 'text-white/90'
										: 'text-purple-200/70'
								}`}
							>
								<span
									className={`font-medium ${
										chatRoom.id === props.chatRoomActive?.id
											? 'text-white'
											: 'text-purple-300'
									}`}
								>
									{authUser?.username === chatRoom.latestMessage.sender
										? 'Bạn: '
										: `${chatRoom.latestMessage.sender}: `}
								</span>
								{chatRoom.latestMessage.attachments?.length
									? '📎 Đã gửi 1 ảnh'
									: chatRoom.latestMessage.message}
							</p>
							{chatRoom.id !== props.chatRoomActive?.id && (
								<div className="ml-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-500"></div>
							)}
						</div>
					)}

					{chatRoom.type === 'GROUP' && (
						<div className="mt-1 flex items-center">
							<div className="mr-2 flex -space-x-2">
								{chatRoom.members.slice(0, 3).map((member, idx) => (
									<div
										key={idx}
										className={`h-4 w-4 rounded-full border ${
											chatRoom.id === props.chatRoomActive?.id
												? 'border-white/40 bg-white/30'
												: 'border-white/20 bg-purple-400'
										}`}
									></div>
								))}
							</div>
							<p
								className={`text-xs ${
									chatRoom.id === props.chatRoomActive?.id
										? 'text-white/80'
										: 'text-purple-300/60'
								}`}
							>
								{chatRoom.members.length} thành viên
							</p>
						</div>
					)}
				</div>
			</motion.div>
		));
	};

	const renderPendingRooms = () => {
		if (isLoadingPending) {
			return Array.from({ length: 4 }).map((_, index) => (
				<ChatRoomSkeleton key={index} />
			));
		}

		if (pendingRooms.length === 0) {
			return (
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="flex flex-col items-center justify-center px-6 py-12 text-center"
				>
					<div className="mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
						<svg
							className="h-12 w-12 text-amber-400/60"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<h3 className="mb-2 text-lg font-semibold text-white">
						Không có tin nhắn chờ
					</h3>
					<p className="text-sm text-amber-200/60">
						Tất cả lời mời đã được xử lý
					</p>
				</motion.div>
			);
		}

		return pendingRooms.map((chatRoom, index) => (
			<motion.div
				key={chatRoom.id}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: index * 0.1 }}
				onClick={() => handleChatRoomClick(chatRoom)}
				className="group relative mx-2 my-1 flex cursor-pointer items-center rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 transition-all duration-300 hover:border-amber-500/30 hover:bg-amber-500/20"
			>
				<div className="relative">
					<Avatar
						author={getChatRoomName(chatRoom)}
						src={chatRoom.avatar}
						className="h-12 w-12 ring-2 ring-amber-500/30 transition-all duration-300 group-hover:ring-amber-500/50"
						isGroupAvatar={chatRoom.type === 'GROUP'}
					/>
					<div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500">
						<svg
							className="h-3 w-3 text-white"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
				</div>

				<div className="ml-3 flex-1 overflow-hidden">
					<div className="flex items-center justify-between">
						<p className="truncate font-semibold text-white transition-colors group-hover:text-amber-100">
							{getChatRoomName(chatRoom)}
						</p>
						<span className="ml-2 flex-shrink-0 text-xs text-amber-200/60">
							Chờ xác nhận
						</span>
					</div>

					<p className="mt-1 truncate text-sm text-amber-200/70">
						Lời mời tham gia nhóm chat
					</p>

					{chatRoom.type === 'GROUP' && (
						<div className="mt-1 flex items-center">
							<p className="text-xs text-amber-300/60">
								{chatRoom.members.length} thành viên
							</p>
						</div>
					)}
				</div>
			</motion.div>
		));
	};

	return (
		<ChatRoomsContext.Provider
			value={{ chatRooms, createLatestChatRoom, updateChatRoom }}
		>
			<motion.div
				ref={sideBarRef}
				className={`relative flex h-full flex-col border-r border-white/10 bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900 backdrop-blur-sm sm:max-w-[320px] sm:min-w-[280px] ${props.isOpenSidebar ? 'w-full sm:w-auto' : 'w-0 overflow-hidden'}`}
			>
				<SideBarHeader />

				{/* Tabs */}
				<div className="mx-4 flex border-b border-white/10">
					<button
						onClick={() => setActiveTab('rooms')}
						className={`relative flex-1 px-4 py-3 text-sm font-medium transition-all duration-300 ${
							activeTab === 'rooms'
								? 'text-white'
								: 'text-purple-200/60 hover:text-purple-100'
						}`}
					>
						Danh sách phòng
						{activeTab === 'rooms' && (
							<motion.div
								layoutId="activeTab"
								className="absolute right-0 bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
							/>
						)}
					</button>
					<button
						onClick={() => setActiveTab('pending')}
						className={`relative flex-1 px-4 py-3 text-sm font-medium transition-all duration-300 ${
							activeTab === 'pending'
								? 'text-white'
								: 'text-amber-200/60 hover:text-amber-100'
						}`}
					>
						Tin nhắn chờ
						{activeTab === 'pending' && (
							<motion.div
								layoutId="activeTab"
								className="absolute right-0 bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500"
							/>
						)}
						{pendingRooms.length > 0 && (
							<span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber-500"></span>
						)}
					</button>
				</div>

				{/* Search Bar */}
				<div className="p-4">
					<div className="relative">
						<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<svg
								className="h-5 w-5 text-purple-300/60"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
						<input
							type="text"
							placeholder={`Tìm kiếm ${activeTab === 'rooms' ? 'phòng chat' : 'tin nhắn chờ'}...`}
							className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pr-4 pl-10 text-white placeholder-purple-200/40 backdrop-blur-sm transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
						/>
					</div>
				</div>

				{/* Content */}
				<div className="scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent flex-1 overflow-y-auto px-2">
					{activeTab === 'rooms' ? renderChatRooms() : renderPendingRooms()}
				</div>

				{/* User Profile Footer */}
				<div className="border-t border-white/10 bg-gradient-to-r from-purple-600/10 to-pink-600/10 p-4 backdrop-blur-sm">
					<div className="flex cursor-pointer items-center space-x-3 rounded-2xl bg-white/5 p-3 transition-all duration-300 hover:bg-white/10">
						<Avatar
							author={authUser?.username || 'User'}
							src={authUser?.avatar || ''}
							className="h-10 w-10 ring-2 ring-purple-500/40"
						/>
						<div className="min-w-0 flex-1">
							<p className="truncate font-semibold text-white">
								{authUser?.username}
							</p>
							<p className="truncate text-xs text-purple-300/60">
								Đang hoạt động
							</p>
						</div>
						<div className="h-2 w-2 rounded-full bg-green-400"></div>
					</div>
				</div>
			</motion.div>
		</ChatRoomsContext.Provider>
	);
}
