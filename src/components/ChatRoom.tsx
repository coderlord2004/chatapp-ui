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
import { MessageResponseType } from '@/types/types';

type ChatRoomProps = {
	authUsername: string | undefined;
	chatRoomInfo: ChatRoomInfo;
};

export default function ChatRoom({
	authUsername,
	chatRoomInfo,
}: ChatRoomProps) {
	const [messagePage, setMessagePage] = useState<number>(1);
	const roomId = chatRoomInfo.id;
	const { accessToken } = useAuth();
	const decodedJwt = accessToken && decodeJwt(accessToken);
	const messages = useMessages(`${roomId}`, messagePage);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const scrollToBottomButton = useRef<HTMLDivElement>(null);
	const { setSearchUserModal } = useSearchUser();
	const [optimisticMessages, setOptimisticMessage] = useState<
		MessageResponseType[]
	>([]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	const sendOptimistic = (message: MessageResponseType) => {
		setOptimisticMessage((prev) => [...prev, message]);
	};

	useEffect(() => {
		scrollToBottom();
		setOptimisticMessage(messages);
	}, [messages]);

	useEffect(() => {
		scrollToBottom();
	}, [optimisticMessages]);

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

	return (
		<div className="lsm:flex relative hidden flex-1 flex-col bg-gray-900">
			{/* Chat Header */}
			<div className="flex max-h-[60px] items-center justify-between border-b border-gray-800 bg-gray-800/50 px-4 py-[10px]">
				<div className="flex items-center">
					{chatRoomInfo.avatar ? (
						<img
							src={chatRoomInfo.avatar}
							alt=""
							className="h-10 w-10 rounded-full object-cover"
						/>
					) : chatRoomInfo.type === 'DUO' ? (
						<FaUserCircle className="h-10 w-10 text-gray-400" />
					) : (
						<HiUserGroup className="h-10 w-10 rounded-[50%] border-[1px] border-solid border-blue-500 text-gray-400 hover:border-blue-700" />
					)}
					<div className="ml-3">
						<h2 className="font-semibold">{getChatRoomName(chatRoomInfo)}</h2>
						{chatRoomInfo.type === 'GROUP' && (
							<p className="text-xs text-gray-400">
								{chatRoomInfo.membersUsername.length} members
							</p>
						)}
					</div>
				</div>
				{chatRoomInfo.type === 'GROUP' && (
					<div
						title="Thêm bạn bè"
						className="cursor-pointer text-[30px] hover:text-yellow-400"
						onClick={() =>
							setSearchUserModal({
								isOpen: true,
								chatGroupId: chatRoomInfo.id,
							})
						}
					>
						<MdPersonAddAlt />
					</div>
				)}
			</div>

			{/* Messages Container */}
			<div
				className="flex-1 space-y-3 overflow-y-auto bg-gray-900/50 p-4 transition-all duration-200"
				onScroll={(e) => {
					if (
						scrollToBottomButton.current &&
						e.target instanceof HTMLElement &&
						e.target.scrollHeight - e.target.scrollTop >
						e.target.clientHeight + 50
					) {
						scrollToBottomButton.current.style.display = 'block';
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
				{optimisticMessages.map((msg, idx) => (
					<div
						key={msg.id}
						className={`flex ${decodedJwt && decodedJwt.sub === msg.sender
							? 'justify-end'
							: 'justify-start'
							}`}
					>
						<div
							className={`animate-fadeInUp flex max-w-xs translate-y-[5px] transform flex-col items-end justify-center gap-[14px] opacity-0 transition-all duration-150 md:max-w-md lg:max-w-lg`}
						>
							<div
								className={`group relative rounded-lg p-[8px] text-gray-100 ${decodedJwt && decodedJwt.sub === msg.sender
									? 'rounded-br-none bg-indigo-600'
									: 'rounded-bl-none bg-gray-800'
									}`}
							>
								{decodedJwt && decodedJwt.sub !== msg.sender && (
									<p className="mb-1 text-xs font-semibold text-indigo-300">
										{msg.sender}
									</p>
								)}
								<p className="h-full w-full">{msg.message}</p>
								<p
									className={`absolute top-[100%] right-0 text-[60%] whitespace-nowrap text-gray-500 ${idx === optimisticMessages.length - 1 ? '' : 'hidden group-hover:block'}`}
								>
									{msg.sending
										? 'Đang gửi'
										: `Đã gửi lúc ${formatTime(msg.sentOn || '')}`}
								</p>
							</div>

							{msg.attachments.map((attachment, idx) => {
								if (attachment.type === 'IMAGE') {
									return (
										<div
											key={msg.id + idx}
											className="h-[250px] w-[200px] rounded-[7px]"
										>
											<Image src={attachment.source} />
										</div>
									);
								} else if (attachment.type === 'VIDEO') {
									return (
										<div
											key={msg.id + idx}
											className="max-w-[70%] rounded-[7px]"
										>
											<video
												src={attachment.source}
												className="rounded-[8px] object-cover"
												controls
											/>
										</div>
									);
								}
							})}
						</div>
					</div>
				))}

				{/* Empty div for auto-scrolling */}
				<div ref={messagesEndRef} />
			</div>

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
				onSendOptimistic={sendOptimistic}
			/>
		</div>
	);
}
