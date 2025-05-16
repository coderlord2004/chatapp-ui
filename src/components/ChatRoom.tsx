import React, { useState, useRef, useEffect } from 'react';
import { useRequest } from '@/hooks/useRequest';
import { useAuth } from '@/contexts/AuthContext';
import { decodeJwt } from 'jose';
import { useMessages } from '@/hooks/useMessages';
import { ChatRoomInfo } from '@/types/types';
import ChatInput from './ChatInput';
import { FaUserCircle, FaArrowDown } from 'react-icons/fa';
import { MdPersonAddAlt } from 'react-icons/md';
import formatDateTime from '@/utils/formatDateTime';
import { useSearchUser } from '@/hooks/useSearchUser';

type ChatRoomProps = {
	authUsername: string | undefined;
	chatRoomInfo: ChatRoomInfo;
};

export default function ChatRoom({
	authUsername,
	chatRoomInfo,
}: ChatRoomProps) {
	const messageInput = useRef<HTMLInputElement>(null);
	const roomId = chatRoomInfo.id;
	const { accessToken } = useAuth();
	const decodedJwt = accessToken && decodeJwt(accessToken);
	const messages = useMessages(`${roomId}`);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const scrollToBottomButton = useRef<HTMLDivElement>(null);
	const { setSearchUserModal } = useSearchUser();
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	function getChatRoomName(info: ChatRoomInfo) {
		const { membersUsername, name } = info;
		if (name) {
			return name;
		}
		return membersUsername
			.filter((username) => username !== authUsername)
			.join(', ');
	}

	return (
		<div className="relative flex flex-1 flex-col bg-gray-900">
			{/* Chat Header */}
			<div className="flex items-center justify-between border-b border-gray-800 bg-gray-800/50 p-4">
				<div className="flex items-center">
					{chatRoomInfo.avatar ? (
						<img
							src={chatRoomInfo.avatar}
							alt=""
							className="h-10 w-10 rounded-full object-cover"
						/>
					) : (
						<FaUserCircle className="h-10 w-10 text-gray-400" />
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
				{messages.map((msg, idx) => (
					<div
						key={msg.id}
						className={`flex ${
							decodedJwt && decodedJwt.sub === msg.sender
								? 'justify-end'
								: 'justify-start'
						}`}
					>
						<div
							className={`animate-fadeInUp max-w-xs translate-y-[5px] transform rounded-lg px-[12px] py-[8px] opacity-0 transition-all duration-150 md:max-w-md lg:max-w-lg ${
								decodedJwt && decodedJwt.sub === msg.sender
									? 'rounded-br-none bg-indigo-600'
									: 'rounded-bl-none bg-gray-800'
							}`}
							style={{
								animationDelay: `${idx === messages.length - 1 ? '0.1s' : '0s'}`,
							}}
						>
							{decodedJwt && decodedJwt.sub !== msg.sender && (
								<p className="mb-1 text-xs font-semibold text-indigo-300">
									{msg.sender}
								</p>
							)}
							<p className="text-gray-100">{msg.message}</p>
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
			<ChatInput roomId={roomId} />
		</div>
	);
}
