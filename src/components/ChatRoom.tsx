'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { decodeJwt } from 'jose';
import useMessages from '@/hooks/useMessages';
import { ChatRoomInfo } from '@/types/ChatRoom';
import ChatInput from './ChatInput';
import Avatar from './Avatar';

import { FaPhoneAlt, FaUserCircle, FaArrowDown } from 'react-icons/fa';
import { MdPersonAddAlt } from 'react-icons/md';
import { HiUserGroup } from 'react-icons/hi2';
import { IoIosVideocam, IoIosArrowBack } from 'react-icons/io';

import { formatDateTime } from '@/utils/formatDateTime';
import { useSearchUser } from '@/hooks/useSearchUser';
import Message from '@/components/Message';
import CallModal from '@/components/CallModal';

type ChatRoomProps = {
	chatRoomInfo: ChatRoomInfo;
	isOpenSidebar: boolean;
	onOpenSidebar: () => void;
};

type UploadProgressType = {
	id: number | null;
	percent: number;
};

type InitCallModal = {
	isOpen: boolean;
	video: boolean;
};

export default function ChatRoom({
	chatRoomInfo,
	isOpenSidebar,
	onOpenSidebar,
}: ChatRoomProps) {
	const roomId = chatRoomInfo.id;
	const {
		messages,
		insertFakeMessage,
		updateMessage,
		deleteMessage,
		handleFetchNewMessages,
		isLoading,
	} = useMessages(roomId);
	const messagePage = useRef<number>(1);
	const { authUser, accessToken } = useAuth();
	const decodedJwt = accessToken && decodeJwt(accessToken);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const scrollToBottomButton = useRef<HTMLDivElement>(null);
	const { setSearchUserModal } = useSearchUser();
	const [uploadProgress, setUploadProgress] = useState<UploadProgressType>({
		id: null,
		percent: 0,
	});

	const [isShowChatRoomInfo, setIsShowChatRoomInfo] = useState<boolean>(false);

	const [initCallModal, setInitCallModal] = useState<InitCallModal>({
		isOpen: false,
		video: false,
	});
	const messageContainerRef = useRef<HTMLDivElement | null>(null);
	const messageContainerScrollHeightRef = useRef<number>(0);
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		if (messageContainerRef.current) {
			messageContainerScrollHeightRef.current =
				messageContainerRef.current.scrollHeight;
		}
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages.length, roomId]);

	useEffect(() => {
		if (uploadProgress.percent === 100) {
			setUploadProgress({
				id: null,
				percent: -1,
			});
		}
	}, [uploadProgress]);

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

	return (
		<div
			className={`chatroom relative z-[5] flex h-screen w-full flex-col bg-gray-900`}
		>
			<div className="header flex max-h-[60px] items-center justify-between border-b border-gray-800 bg-gray-800/50 px-4 py-3 sm:px-4 sm:py-3">
				<div className="flex items-center">
					<button
						className="mr-2 block cursor-pointer text-2xl hover:text-green-400 sm:hidden"
						onClick={onOpenSidebar}
						aria-label="Toggle sidebar"
					>
						<IoIosArrowBack />
					</button>

					<div
						className="flex cursor-pointer items-center"
						onClick={() => setIsShowChatRoomInfo(true)}
					>
						{chatRoomInfo.avatar ? (
							<img
								src={chatRoomInfo.avatar}
								alt=""
								className="h-8 w-8 rounded-full object-cover sm:h-10 sm:w-10"
							/>
						) : chatRoomInfo.type === 'DUO' ? (
							<FaUserCircle className="h-8 w-8 text-gray-400 sm:h-10 sm:w-10" />
						) : (
							<HiUserGroup className="h-8 w-8 rounded-[50%] border-[1px] border-solid border-blue-500 text-gray-400 hover:border-blue-700 sm:h-10 sm:w-10" />
						)}
						<div className="ml-2 sm:ml-3">
							<h2 className="text-sm font-semibold sm:text-base">
								{getChatRoomName(chatRoomInfo)}
							</h2>
							{chatRoomInfo.type === 'GROUP' && (
								<p className="text-xs text-gray-400">
									{chatRoomInfo.members.length} members
								</p>
							)}
						</div>
					</div>
				</div>

				<div className="flex items-center gap-2 sm:gap-3">
					<button
						className="cursor-pointer hover:text-yellow-400"
						onClick={() =>
							setInitCallModal({
								isOpen: true,
								video: false,
							})
						}
					>
						<FaPhoneAlt />
					</button>

					<button
						className="cursor-pointer text-xl hover:text-yellow-400 sm:text-2xl"
						onClick={() =>
							setInitCallModal({
								isOpen: true,
								video: true,
							})
						}
						aria-label="Video call"
					>
						<IoIosVideocam />
					</button>

					<button
						title="Thêm bạn bè"
						className="cursor-pointer text-xl hover:text-yellow-400 sm:text-2xl"
						onClick={() =>
							setSearchUserModal({
								isOpen: true,
								chatGroupId: chatRoomInfo.id,
							})
						}
						aria-label="Add friend"
					>
						<MdPersonAddAlt />
					</button>
				</div>
			</div>

			<div
				ref={messageContainerRef}
				className="message-container flex flex-1 flex-col gap-[5px] overflow-y-auto bg-gray-900/50 p-[10px] transition-all duration-200"
				onScroll={(e) => {
					const div = e.target;
					if (
						scrollToBottomButton.current &&
						messageContainerRef.current &&
						div instanceof HTMLElement &&
						div.scrollHeight - div.scrollTop > div.clientHeight + 100
					) {
						scrollToBottomButton.current.style.display = 'block';
						console.log('scroll top: ', div.scrollTop);
						console.log(
							'messageContainerRef: ',
							messageContainerRef.current.scrollHeight,
						);

						if (div.scrollTop <= 0) {
							messagePage.current += 1;
							handleFetchNewMessages(messagePage.current);
						}
					} else if (scrollToBottomButton.current) {
						scrollToBottomButton.current.style.display = 'none';
					}
				}}
			>
				<div className="mx-auto mt-[10%] flex h-auto w-[50%] flex-col items-center justify-center gap-y-[5px] rounded-[8px] bg-slate-800 px-[10px] py-[5px] md:w-[350px]">
					<img
						src="./bg_image_2.jpeg"
						alt=""
						className="h-auto w-full rounded-[8px] object-cover"
					/>
					<div className="flex items-center justify-center gap-x-[10px]">
						{chatRoomInfo.avatar ? (
							<img
								src={chatRoomInfo.avatar}
								alt=""
								className="h-[50px] w-[50px]"
							/>
						) : (
							<FaUserCircle className="h-[70px] w-[70px] text-gray-400" />
						)}
						<div>
							<p>{getChatRoomName(chatRoomInfo)}</p>
							<p className="text-[80%] text-gray-400">
								Bạn với người này đã trở thành bạn bè. Chat ngay thôi!
							</p>
						</div>
					</div>
					<p className="text-[75%] text-gray-500">
						{chatRoomInfo.type === 'DUO' ? 'Kết bạn lúc: ' : 'Đã tạo lúc: '}{' '}
						{formatDateTime(chatRoomInfo.createdOn)}
					</p>
				</div>

				{isLoading === messagePage.current && isLoading === 1
					? Array.from({ length: 5 }, (_, idx) => (
							<div
								key={idx}
								className={`flex w-full animate-pulse ${idx % 2 === 0 ? 'justify-end' : 'justify-start'}`}
							>
								<div className="group relative w-[200px] max-w-[80%] rounded-lg bg-gray-800 p-[8px] text-gray-100">
									<div className="mb-2 h-[20px] w-[80%] bg-gray-700"></div>
									<div className="mb-1 h-[15px] w-[60%] bg-gray-700"></div>
									<div className="h-[10px] w-[40%] bg-gray-700"></div>
								</div>
							</div>
						))
					: messages.map((msg, idx) => (
							<Message
								key={msg.id}
								index={idx}
								message={msg}
								totalMessages={messages.length}
								uploadProgress={uploadProgress}
								updateMessage={updateMessage}
								deleteMessage={deleteMessage}
							/>
						))}

				<div ref={messagesEndRef} />
			</div>

			{isShowChatRoomInfo && (
				<div className="animate-fade-in-to-left absolute top-0 right-0 z-50 flex h-full w-[50%] flex-col items-center justify-start bg-gray-900 px-[10px] py-[20px] shadow-lg">
					<h2>Danh sách thành viên</h2>
					<button
						className="absolute top-2 right-2 cursor-pointer text-[200%] text-white hover:text-red-500"
						aria-label="Close chat room info"
						onClick={() => setIsShowChatRoomInfo(false)}
					>
						&times;
					</button>

					{chatRoomInfo.members.map((user) => (
						<div
							key={user.id}
							className="flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-left transition-colors duration-200 hover:bg-gray-800"
						>
							<Avatar
								author={user.username}
								src={user.avatar}
								className="h-10 w-10"
							/>
							<p>{user.username}</p>
						</div>
					))}
				</div>
			)}

			<div
				className="absolute bottom-[80px] left-1/2 translate-x-[-50%] transform cursor-pointer rounded-[50%] bg-black/80 p-[5px] text-[20px]"
				onClick={scrollToBottom}
				ref={scrollToBottomButton}
			>
				<FaArrowDown />
			</div>

			<ChatInput
				authUsername={
					typeof decodedJwt?.sub === 'string' ? decodedJwt.sub : undefined
				}
				roomId={roomId}
				onSendOptimistic={insertFakeMessage}
				onSetUploadProgress={setUploadProgress}
			/>

			{initCallModal.isOpen && (
				<CallModal
					roomId={roomId}
					isUseVideo={initCallModal.video}
					members={chatRoomInfo.members}
					callInvitation={null}
					onClose={() =>
						setInitCallModal({
							isOpen: false,
							video: false,
						})
					}
				/>
			)}
		</div>
	);
}
