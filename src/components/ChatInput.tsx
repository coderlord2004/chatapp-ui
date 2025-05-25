import React, { useState, useRef, useEffect } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { FaPaperPlane } from 'react-icons/fa';
import { useRequest } from '@/hooks/useRequest';
import { MdAttachFile } from 'react-icons/md';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { MessageResponseType } from '@/types/types';

type ChatRoomProps = {
	authUsername: string | undefined;
	roomId: number;
	onSendOptimistic: (msg: MessageResponseType) => void;
};

type AttachmentTypes = {
	imagePreview: string;
	fileData: File;
};

export default function ChatInput({
	authUsername,
	roomId,
	onSendOptimistic,
}: ChatRoomProps) {
	const { post } = useRequest();
	const [message, setMessage] = useState('');
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const messageInputRef = useRef<HTMLInputElement>(null);
	const [attachments, setAttachments] = useState<AttachmentTypes[] | null>(
		null,
	);

	const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const form = e.currentTarget;
		const formData = new FormData();
		const text = message.trim();

		if (attachments) {
			for (let i = 0; i < attachments.length; i++) {
				formData.append('attachments', attachments[i].fileData);
			}
		}

		const fakeId = -Date.now();
		if (text) {
			formData.append('message', text);
		}
		console.log('attachment:', {
			id: fakeId,
			message: text,
			sender: authUsername || 'you',
			sentOn: new Date().toISOString(),
			attachments:
				attachments?.map((a) => ({
					source: a.imagePreview,
					type: a.fileData.type.startsWith('video') ? 'VIDEO' : 'IMAGE',
				})) || [],
			sending: true,
		});
		onSendOptimistic({
			id: fakeId,
			message: text,
			sender: authUsername || 'you',
			sentOn: new Date().toISOString(),
			attachments:
				attachments?.map((a) => ({
					source: a.imagePreview,
					type: a.fileData.type.startsWith('video') ? 'VIDEO' : 'IMAGE',
				})) || [],
			sending: true,
		});

		try {
			await post(`messages/`, formData, { params: { room: roomId } });
		} catch (err) {
			console.error('Send failed:', err);
		}

		form.reset();
		setMessage('');
		setAttachments(null);
	};

	const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		const newAttachments = files.map((file) => ({
			imagePreview: URL.createObjectURL(file),
			fileData: file,
		}));
		setAttachments((prev) => [...(prev ?? []), ...newAttachments]);
	};

	const addEmoji = (emoji: { native: string }) => {
		const cursor = messageInputRef.current?.selectionStart ?? message.length;
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

	useEffect(() => {}, [attachments]);

	return (
		<div className="relative flex flex-col gap-[15px] border-t border-gray-800 bg-gray-800/50 p-4">
			<form className="flex gap-2" onSubmit={sendMessage}>
				<div className="flex items-center justify-center">
					<input
						id="attachments"
						name="attachments"
						type="file"
						onChange={handleFilesChange}
						className="hidden"
						multiple
					/>
					<label
						htmlFor="attachments"
						className="cursor-pointer text-[25px] hover:text-amber-300"
					>
						<MdAttachFile />
					</label>
				</div>
				<div className="flex h-full flex-1 items-center rounded-lg border border-gray-600 bg-gray-700 focus-within:ring-2 focus-within:ring-indigo-500">
					<input
						ref={messageInputRef}
						type="text"
						name="message"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="Type a message..."
						className="h-full w-full rounded-lg px-4 py-2 text-gray-100 focus:border-transparent focus:outline-none"
					/>
					<div className="relative flex cursor-pointer items-center text-[23px]">
						<p
							className="select-none"
							onClick={() => setShowEmojiPicker((prev) => !prev)}
						>
							😊
						</p>

						{showEmojiPicker && (
							<div className="absolute right-0 bottom-[100%] z-10 cursor-pointer">
								<Picker data={data} onEmojiSelect={addEmoji} />
							</div>
						)}
					</div>
				</div>
				<button
					type="submit"
					disabled={!message.trim()}
					className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<FaPaperPlane />
				</button>
			</form>

			{attachments && attachments.length !== 0 && (
				<div className="flex flex-wrap gap-[10px]">
					{attachments.map((attachment) => (
						<div
							key={attachment.imagePreview}
							className="relative h-[100px] w-[100px]"
						>
							<div
								className="absolute top-[-10px] right-[-10px] cursor-pointer text-[23px]"
								onClick={() => {
									URL.revokeObjectURL(attachment.imagePreview);
									setAttachments((prev) => {
										const newAttachments = prev?.filter(
											(n) => n.imagePreview !== attachment.imagePreview,
										);

										return newAttachments || null;
									});
								}}
							>
								<IoIosCloseCircleOutline />
							</div>
							<img
								src={attachment.imagePreview}
								alt=""
								className="rounded-[10px] object-cover"
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
