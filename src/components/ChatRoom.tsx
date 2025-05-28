import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { decodeJwt } from 'jose';
import useMessages from '@/hooks/useMessages';
import { ChatRoomInfo } from '@/types/types';
import ChatInput from './ChatInput';
import { FaUserCircle, FaArrowDown } from 'react-icons/fa';
import { MdPersonAddAlt } from 'react-icons/md';
import { formatDateTime, formatTime } from '@/utils/formatDateTime';
import { useSearchUser } from '@/hooks/useSearchUser';
import { HiUserGroup } from 'react-icons/hi2';
import Image from '@/components/Image';
import ProgressLoading from './ProgressLoading';
import { FaDownload } from 'react-icons/fa';
import { HiOutlineDotsCircleHorizontal } from 'react-icons/hi';
import { useRequest } from '@/hooks/useRequest';
import VideoCall from '@/components/VideoCall';
import { IoIosVideocam, IoIosArrowBack } from 'react-icons/io';

type ChatRoomProps = {
	authUsername: string | undefined;
	chatRoomInfo: ChatRoomInfo;
	isOpenSidebar: boolean;
	onOpenSidebar: () => void;
};

type UploadProgressType = {
	id: number | null;
	percent: number;
};

type MessageMenuType = {
	id: number | null;
	isOpen: boolean;
};

export default function ChatRoom({
	authUsername,
	chatRoomInfo,
	isOpenSidebar,
	onOpenSidebar,
}: ChatRoomProps) {
	const roomId = chatRoomInfo.id;
	const [messagePage, setMessagePage] = useState<number>(1);
	const {
		messages,
		insertFakeMessages,
		updateMessage,
		deleteMessage,
		isLoading,
	} = useMessages(`${roomId}`, messagePage);

	const { accessToken } = useAuth();
	const decodedJwt = accessToken && decodeJwt(accessToken);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const scrollToBottomButton = useRef<HTMLDivElement>(null);
	const { setSearchUserModal } = useSearchUser();
	const [uploadProgress, setUploadProgress] = useState<UploadProgressType>({
		id: null,
		percent: 0,
	});
	const [isShowMessageMenu, setShowMessageMenu] = useState<MessageMenuType>({
		id: null,
		isOpen: false,
	});
	const { put, remove } = useRequest();

	const [isUpdateMessage, setIsUpdateMessage] = useState<number | null>(null);
	const updateMessageRef = useRef<HTMLInputElement>(null);
	const [isShowChatRoomInfo, setIsShowChatRoomInfo] = useState<boolean>(false);

	const [isStartVideoCall, setIsStartVideoCall] = useState<boolean>(false);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		setMessagePage(1);
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

	async function handleDeleteMessage(messageId: number) {
		await remove(`/messages/${messageId}`);
		deleteMessage(messageId);
	}

	async function handleUpdateMessage(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const messageId = isUpdateMessage;
		const newMessage = updateMessageRef.current?.value.trim();

		if (!newMessage || !messageId) return;

		const formData = new FormData();
		formData.append('message', newMessage);

		updateMessage(messageId, newMessage, true, false);

		await put(`/messages/${messageId}`, formData);

		updateMessage(messageId, newMessage, false, true);
	}

	function getChatRoomName(info: ChatRoomInfo) {
		const { membersUsername, name } = info;
		if (name) {
			return name;
		}
		return membersUsername
			.filter((username) => username !== authUsername)
			.slice(0, 3)
			.join(', ');
	}

	function isAuthUser(sender: string): boolean {
		if (!decodedJwt) return false;

		return decodedJwt.sub === sender;
	}

	return (
		<div
			className={`chatroom ${isOpenSidebar ? 'w-0' : 'w-full'} relative z-[5] flex h-screen flex-col bg-gray-900`}
		>
			{/* Chat Header */}
			<div className="header flex max-h-[60px] items-center justify-between border-b border-gray-800 bg-gray-800/50 px-4 py-3 sm:px-4 sm:py-3">
				<div className="flex items-center">
					{/* Back button for mobile */}
					<button
						className="mr-2 block cursor-pointer text-2xl hover:text-green-400 sm:hidden"
						onClick={onOpenSidebar}
						aria-label="Toggle sidebar"
					>
						<IoIosArrowBack />
					</button>

					{/* Chat info */}
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
									{chatRoomInfo.membersUsername.length} members
								</p>
							)}
						</div>
					</div>
				</div>

				{/* Action buttons */}
				{chatRoomInfo.type === 'DUO' && (
					<div className="flex items-center gap-2 sm:gap-3">
						<button
							className="cursor-pointer text-xl hover:text-yellow-400 sm:text-2xl"
							onClick={() => setIsStartVideoCall(!isStartVideoCall)}
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
				)}
			</div>

			{/* Messages Container */}
			<div
				className="message-container flex flex-1 flex-col gap-[10px] overflow-y-auto bg-gray-900/50 p-[10px] transition-all duration-200"
				onScroll={(e) => {
					if (
						scrollToBottomButton.current &&
						e.target instanceof HTMLElement &&
						e.target.scrollHeight - e.target.scrollTop >
							e.target.clientHeight + 100
					) {
						scrollToBottomButton.current.style.display = 'block';
						if (
							e.target.scrollHeight - e.target.scrollTop ===
							e.target.scrollHeight
						) {
							setMessagePage((prev) => prev + 1);
						}
					} else if (scrollToBottomButton.current) {
						scrollToBottomButton.current.style.display = 'none';
					}
				}}
			>
				<div className="mx-auto mt-[10%] flex w-[200px] flex-col gap-y-[5px] rounded-[8px] bg-slate-800 px-[10px] py-[5px]">
					<img
						src="./bg_image_2.jpeg"
						alt=""
						className="h-auto w-[200px] rounded-[8px] object-cover"
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
						{formatDateTime(chatRoomInfo.createdOn)}
					</p>
				</div>

				{isLoading
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
							<div
								key={msg.id}
								className={`flex ${
									isAuthUser(msg.sender) ? 'justify-end' : 'justify-start'
								}`}
							>
								<div
									className={`animate-fadeInUp flex h-full max-w-[85%] transform flex-col items-end justify-center gap-[12px] opacity-0 transition-all duration-150 md:max-w-md lg:max-w-lg ${isAuthUser(msg.sender) ? 'items-end' : 'items-start'}`}
								>
									{msg.message && (
										<div
											className={`group relative rounded-lg p-[8px] text-gray-100 ${
												isAuthUser(msg.sender)
													? 'rounded-br-none bg-indigo-600'
													: 'rounded-bl-none bg-gray-800'
											}`}
										>
											{!isAuthUser(msg.sender) && (
												<p className="mb-1 text-xs font-semibold text-indigo-300">
													{msg.sender}
												</p>
											)}

											{isUpdateMessage === msg.id ? (
												<form
													className="h-full w-full"
													onSubmit={handleUpdateMessage}
												>
													<input
														ref={updateMessageRef}
														type="text"
														name="updateMessage"
														className="h-full w-full bg-transparent text-gray-100 outline-none"
														defaultValue={msg.message}
														autoFocus
														onBlur={() => setIsUpdateMessage(null)}
													/>
												</form>
											) : (
												<p className="h-full w-full max-w-[50vw] break-words">
													{msg.message}
												</p>
											)}

											<p
												className={`absolute top-[100%] ${isAuthUser(msg.sender) ? 'right-0' : 'left-0'} text-[60%] whitespace-nowrap text-gray-500 ${idx === messages.length - 1 ? '' : 'hidden group-hover:block'}`}
											>
												{msg.sending
													? 'Đang gửi'
													: `Đã gửi lúc ${formatTime(msg.sentOn || '')}`}
											</p>

											{isAuthUser(msg.sender) && (
												<div className="absolute top-1/2 right-[100%] translate-y-[-50%] transform cursor-pointer opacity-0 group-hover:opacity-100">
													<div
														onClick={() =>
															setShowMessageMenu((prev) =>
																prev.id === msg.id
																	? { id: null, isOpen: false }
																	: { id: msg.id, isOpen: true },
															)
														}
														className="text-[130%]"
													>
														<HiOutlineDotsCircleHorizontal />
													</div>

													{isShowMessageMenu.id === msg.id && (
														<div className="animate-fadeInUp absolute top-1/2 right-[100%] flex w-auto translate-y-[-50%] transform flex-col gap-[5px] rounded-[8px] bg-slate-700 p-[10px]">
															<div
																className="rounded-[8px] bg-slate-600 p-[7px] whitespace-nowrap transition-colors duration-200 hover:bg-blue-600"
																onClick={() => {
																	setIsUpdateMessage(msg.id);
																	setShowMessageMenu({
																		id: null,
																		isOpen: false,
																	});
																}}
															>
																Sửa tin nhắn
															</div>
															<div
																className="rounded-[8px] bg-slate-600 p-[7px] whitespace-nowrap transition-colors duration-200 hover:bg-red-600"
																onClick={() => handleDeleteMessage(msg.id)}
															>
																Xóa tin nhắn
															</div>
														</div>
													)}
												</div>
											)}
										</div>
									)}

									{msg.attachments && (
										<div
											className={`flex flex-wrap gap-[7px] ${isAuthUser(msg.sender) ? 'justify-end' : 'justify-start'}`}
										>
											{msg.attachments.map((attachment, idx) => (
												<div
													key={msg.id + idx}
													className={`group relative ${attachment.type === 'VIDEO' ? 'basis-[100%]' : 'basis-[calc(100%/2-7px)] sm:basis-[calc(100%/3-7px)]'}`}
												>
													{attachment.type === 'IMAGE' ? (
														<div className="group relative rounded-[7px]">
															<Image src={attachment.source} />
														</div>
													) : attachment.type === 'VIDEO' ? (
														<video
															src={attachment.source}
															className="min-w-[] rounded-[8px] object-cover"
															controls
														/>
													) : (
														<a
															href={attachment.source}
															download={attachment.source}
															className={`group relative flex gap-[10px] rounded-lg p-[8px] text-gray-100 ${
																isAuthUser(msg.sender)
																	? 'rounded-br-none bg-indigo-600'
																	: 'rounded-bl-none bg-gray-800'
															}`}
														>
															Tải xuống
															<FaDownload className="text-[20px]" />
														</a>
													)}

													{uploadProgress.id === msg.id ? (
														<ProgressLoading percent={uploadProgress.percent} />
													) : (
														<div
															className={`absolute top-[100%] ${isAuthUser(msg.sender) ? 'right-0' : 'left-0'} text-[60%] whitespace-nowrap text-gray-500 ${idx === messages.length - 1 ? '' : 'hidden group-hover:block'}`}
														>
															{`Đã gửi lúc ${formatTime(msg.sentOn || '')}`}
														</div>
													)}
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						))}

				{/* Empty div for auto-scrolling */}
				<div ref={messagesEndRef} />
			</div>

			{/* chat room info */}
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

					{chatRoomInfo.membersUsername.map((username) => (
						<div
							key={username}
							className="flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-left hover:bg-gray-800"
						>
							{username}
						</div>
					))}
				</div>
			)}

			{/* scroll button */}
			<div
				className="absolute bottom-[80px] left-1/2 translate-x-[-50%] transform cursor-pointer rounded-[50%] bg-black/80 p-[5px] text-[20px]"
				onClick={scrollToBottom}
				ref={scrollToBottomButton}
			>
				<FaArrowDown />
			</div>

			{/* Message Input */}
			<ChatInput
				authUsername={
					typeof decodedJwt?.sub === 'string' ? decodedJwt.sub : undefined
				}
				roomId={roomId}
				onSendOptimistic={insertFakeMessages}
				onSetUploadProgress={setUploadProgress}
			/>

			{isStartVideoCall && (
				<VideoCall
					isMounted={isStartVideoCall}
					onMounted={() => setIsStartVideoCall(!isStartVideoCall)}
					selfId={authUsername}
					targetId={
						chatRoomInfo.membersUsername.find(
							(username) => username !== authUsername,
						) || ''
					}
					onClose={() => setIsStartVideoCall(false)}
				/>
			)}
		</div>
	);
}
