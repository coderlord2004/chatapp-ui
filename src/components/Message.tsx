import React, { useState, useRef } from 'react';
import { MessageResponseType } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';
import { decodeJwt } from 'jose';
import Image from '@/components/Image';
import ProgressLoading from './Loading/ProgressLoading';
import { FaDownload } from 'react-icons/fa';
import { HiOutlineDotsCircleHorizontal } from 'react-icons/hi';
import { formatTime } from '@/utils/formatDateTime';
import { useRequest } from '@/hooks/useRequest';

type UploadProgressType = {
	id: number | null;
	percent: number;
};

type Props = {
	index: number;
	message: MessageResponseType;
	totalMessages: number;
	uploadProgress: UploadProgressType;
	updateMessage: (
		messageId: number,
		newMessage: string,
		sending: boolean,
		isUpdated: boolean,
	) => void;
	deleteMessage: (messageId: number) => void;
};

type MessageMenuType = {
	id: number | null;
	isOpen: boolean;
};

export default function Message({
	index,
	message,
	totalMessages,
	uploadProgress,
	updateMessage,
	deleteMessage,
}: Props) {
	const { accessToken } = useAuth();
	const decodedJwt = accessToken && decodeJwt(accessToken);
	const [isShowMessageMenu, setShowMessageMenu] = useState<MessageMenuType>({
		id: null,
		isOpen: false,
	});
	const { put, remove } = useRequest();

	const [isUpdateMessage, setIsUpdateMessage] = useState<number | null>(null);
	const updateMessageRef = useRef<HTMLInputElement>(null);

	function isAuthUser(sender: string): boolean {
		if (!decodedJwt) return false;

		return decodedJwt.sub === sender;
	}

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

	return (
		<div
			key={message.id}
			className={`flex ${
				isAuthUser(message.sender) ? 'justify-end' : 'justify-start'
			}`}
		>
			<div
				className={`animate-fadeInUp flex h-full max-w-[85%] transform flex-col items-end justify-center gap-[12px] opacity-0 transition-all duration-150 md:max-w-md lg:max-w-lg ${isAuthUser(message.sender) ? 'items-end' : 'items-start'}`}
			>
				{message.message && (
					<div
						className={`group relative rounded-lg p-[8px] text-gray-100 ${
							isAuthUser(message.sender)
								? 'rounded-br-none bg-indigo-600'
								: 'rounded-bl-none bg-gray-800'
						}`}
					>
						{!isAuthUser(message.sender) && (
							<p className="mb-1 text-xs font-semibold text-indigo-300">
								{message.sender}
							</p>
						)}

						{isUpdateMessage === message.id ? (
							<form className="h-full w-full" onSubmit={handleUpdateMessage}>
								<input
									ref={updateMessageRef}
									type="text"
									name="updateMessage"
									className="h-full w-full bg-transparent text-gray-100 outline-none"
									defaultValue={message.message}
									autoFocus
									onBlur={() => setIsUpdateMessage(null)}
								/>
							</form>
						) : (
							<p className="h-full w-full max-w-[50vw] break-words">
								{message.message}
							</p>
						)}

						<p
							className={`absolute top-[100%] ${isAuthUser(message.sender) ? 'right-0' : 'left-0'} text-[60%] whitespace-nowrap text-gray-500 ${index === totalMessages - 1 ? 'block' : 'hidden group-hover:block'}`}
						>
							{message.sending
								? 'Đang gửi'
								: `Đã gửi lúc ${formatTime(message.sentOn || '')}`}
						</p>

						{isAuthUser(message.sender) && (
							<div className="absolute top-1/2 right-[100%] translate-y-[-50%] transform cursor-pointer opacity-0 group-hover:opacity-100">
								<div
									onClick={() =>
										setShowMessageMenu((prev) =>
											prev.id === message.id
												? { id: null, isOpen: false }
												: { id: message.id, isOpen: true },
										)
									}
									className="text-[130%]"
								>
									<HiOutlineDotsCircleHorizontal />
								</div>

								{isShowMessageMenu.id === message.id && (
									<div className="animate-fadeInUp absolute top-1/2 right-[100%] flex w-auto translate-y-[-50%] transform flex-col gap-[5px] rounded-[8px] bg-slate-700 p-[10px]">
										<div
											className="rounded-[8px] bg-slate-600 p-[7px] whitespace-nowrap transition-colors duration-200 hover:bg-blue-600"
											onClick={() => {
												setIsUpdateMessage(message.id);
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
											onClick={() => handleDeleteMessage(message.id)}
										>
											Xóa tin nhắn
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				)}

				{message.attachments && (
					<div
						className={`flex flex-wrap gap-[7px] ${isAuthUser(message.sender) ? 'justify-end' : 'justify-start'}`}
					>
						{message.attachments.map((attachment, idx) => (
							<div
								key={message.id + idx}
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
								) : attachment.type === 'RAW' ? (
									<audio controls>
										<source src={attachment.source} type="audio/webm" />
									</audio>
								) : (
									<a
										href={attachment.source}
										download={attachment.source}
										className={`group relative flex gap-[10px] rounded-lg p-[8px] text-gray-100 ${
											isAuthUser(message.sender)
												? 'rounded-br-none bg-indigo-600'
												: 'rounded-bl-none bg-gray-800'
										}`}
									>
										Tải xuống
										<FaDownload className="text-[20px]" />
									</a>
								)}

								{uploadProgress.id === message.id ? (
									<ProgressLoading percent={uploadProgress.percent} />
								) : (
									<div
										className={`absolute top-[100%] ${isAuthUser(message.sender) ? 'right-0' : 'left-0'} text-[60%] whitespace-nowrap text-gray-500 ${idx === totalMessages - 1 ? '' : 'hidden group-hover:block'}`}
									>
										{`Đã gửi lúc ${formatTime(message.sentOn || '')}`}
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
