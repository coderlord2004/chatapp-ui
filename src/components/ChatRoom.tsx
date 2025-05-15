import React, { useState, useRef, useEffect } from 'react';
import { useRequest } from '@/hooks/useRequest';
import { useAuth } from '@/contexts/AuthContext';
import { decodeJwt } from 'jose';
import useMessages from '@/hooks/useMessages';
import { FaUserCircle, FaPaperPlane } from 'react-icons/fa';
import { ChatRoomInfo, MessageTypes } from '@/types/types';

type ChatRoomProps = {
	chatRoomInfo: ChatRoomInfo;
};

export default function ChatRoom({ chatRoomInfo }: ChatRoomProps) {
	const messageInput = useRef<HTMLInputElement>(null);
	const roomId = chatRoomInfo.id;
	const { accessToken } = useAuth();
	const decodedJwt = accessToken && decodeJwt(accessToken);
	const { post } = useRequest();
	const messages = useMessages(`${roomId}`);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const sendMessage = async ({ message }: MessageTypes) => {
		if (!message.trim()) return;

		await post(`messages/${roomId}`, {
			message: message,
		});
	};

	return (
		<div className="flex flex-1 flex-col bg-gray-900">
			{/* Chat Header */}
			<div className="flex items-center border-b border-gray-800 bg-gray-800/50 p-4">
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
					<h2 className="font-semibold">{chatRoomInfo.name}</h2>
					{chatRoomInfo.type === 'DUO' && (
						<p className="text-xs text-gray-400">
							{chatRoomInfo.membersUsername.length} members online
						</p>
					)}
				</div>
			</div>

			{/* Messages Container */}
			<div className="flex-1 space-y-3 overflow-y-auto bg-gray-900/50 p-4">
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

			{/* Message Input */}
			<div className="border-t border-gray-800 bg-gray-800/50 p-4">
				<div className="flex gap-2">
					<input
						ref={messageInput}
						type="text"
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								const target = e.target as HTMLInputElement;
								sendMessage({ message: target.value });
								target.value = '';
							}
						}}
						placeholder="Type a message..."
						className="flex-1 rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-gray-100 focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none"
					/>
					<button
						onClick={() => {
							if (messageInput.current) {
								sendMessage({ message: messageInput.current.value });
							}
						}}
						disabled={
							messageInput.current
								? messageInput.current.value.trim()
									? true
									: false
								: undefined
						}
						className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<FaPaperPlane />
					</button>
				</div>
			</div>
		</div>
	);
}
