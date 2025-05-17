import React, { useState, useRef } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { FaPaperPlane } from 'react-icons/fa';
import { useRequest } from '@/hooks/useRequest';
import { MessageTypes } from '@/types/types';

type ChatRoomProps = {
	roomId: number;
};

export default function ChatInput({ roomId }: ChatRoomProps) {
	const { post } = useRequest();
	const [message, setMessage] = useState('');
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const messageInputRef = useRef<HTMLInputElement>(null);

	const sendMessage = async ({ message }: MessageTypes) => {
		if (!message.trim()) return;

		await post(`messages/${roomId}`, {
			message: message,
		});
		setMessage('');
	};

	const addEmoji = (emoji: { native: string }) => {
		const cursor = messageInputRef.current?.selectionStart || message.length;
		const newMessage =
			message.slice(0, cursor) + emoji.native + message.slice(cursor);
		setMessage(newMessage);

		setTimeout(() => {
			messageInputRef.current?.focus();
			messageInputRef.current?.setSelectionRange(
				cursor + emoji.native.length,
				cursor + emoji.native.length,
			);
		}, 0);
	};

	return (
		<div className="relative border-t border-gray-800 bg-gray-800/50 p-4">
			<div className="flex gap-2">
				<div className="flex h-full flex-1 rounded-lg border border-gray-600 bg-gray-700">
					<input
						ref={messageInputRef}
						type="text"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								sendMessage({ message });
							}
						}}
						placeholder="Type a message..."
						className="h-full w-full rounded-lg px-4 py-2 text-gray-100 focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none"
					/>
					<button
						type="button"
						onClick={() => setShowEmojiPicker((prev) => !prev)}
						className="h-full cursor-pointer"
					>
						😊
					</button>
				</div>
				<button
					onClick={() => {
						if (messageInputRef.current) {
							messageInputRef.current.value = '';
							sendMessage({ message });
						}
					}}
					disabled={!message.trim()}
					className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<FaPaperPlane />
				</button>
			</div>

			{showEmojiPicker && (
				<div className="absolute bottom-[50px] left-1/2 z-10 translate-x-[-50%] transform cursor-pointer">
					<Picker data={data} onEmojiSelect={addEmoji} />
				</div>
			)}
		</div>
	);
}
