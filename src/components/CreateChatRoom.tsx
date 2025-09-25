'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRequest } from '@/hooks/useRequest';
import TextInput from './TextInput';
import { motion, AnimatePresence } from 'framer-motion';
import SelectableFriendItem from './SelectableFriendItem';
import { useChatRooms } from '@/hooks/useChatRooms';
import { useNotification } from '@/hooks/useNotification';
import { useAuth } from '@/contexts/AuthContext';
import { ChatRoomInfo } from '@/types/ChatRoom';
import { UserWithAvatar } from '@/types/User';
import { MdClear, MdGroupAdd, MdPersonAdd } from 'react-icons/md';
import { IoSearchCircleOutline, IoClose } from 'react-icons/io5';

type Props = {
	onClose: () => void;
};

type CreateChatRoomRequest = {
	chatRoomName: string | null;
	friends: Set<string>;
};

export default function CreateChatRoom({ onClose }: Props) {
	const { authUser } = useAuth();
	const createChatRoomRequestRef = useRef<CreateChatRoomRequest>({
		chatRoomName: null,
		friends: new Set<string>(),
	});
	const [friends, setFriends] = useState<UserWithAvatar[] | null>(null);
	const [searchVisible, setSearchVisible] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const { post, get } = useRequest();
	const { updateLatestChatRoom } = useChatRooms();
	const { showNotification } = useNotification();

	const handleCreateChatRoom = async () => {
		const createChatRoomRequest = createChatRoomRequestRef.current;

		if (createChatRoomRequest.friends.size === 0) {
			showNotification({
				type: 'error',
				message: 'Vui lòng chọn bạn bè.',
			});
			return;
		}
		if (!createChatRoomRequest.chatRoomName) {
			let chatRoomName = `${authUser?.username}, `;
			createChatRoomRequest.friends.forEach(
				(friend) => (chatRoomName += `${friend}, `),
			);
			createChatRoomRequest.chatRoomName = chatRoomName
				.trim()
				.substring(0, chatRoomName.length - 2);
		}
		const res: ChatRoomInfo = await post('chatroom/create/', {
			chatRoomName: createChatRoomRequestRef.current.chatRoomName,
			members: [...createChatRoomRequestRef.current.friends],
		});
		showNotification({
			type: 'success',
			message: 'Tạo phòng thành công!',
		});
		onClose();
		updateLatestChatRoom(res);
	};

	useEffect(() => {
		const getFriends = async () => {
			const data = await get('users/friends/');
			setFriends(data);
		};

		getFriends();
	}, []);

	const filteredFriends =
		friends?.filter((friend) =>
			friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
		) || [];

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.9, y: 20 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				transition={{ duration: 0.4, ease: 'easeOut' }}
				className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-800"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
					<div className="flex items-center gap-3">
						<div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/30">
							<MdGroupAdd className="text-2xl text-indigo-600 dark:text-indigo-400" />
						</div>
						<h2 className="text-xl font-semibold text-gray-800 dark:text-white">
							Tạo phòng chat mới
						</h2>
					</div>
					<button
						onClick={onClose}
						className="cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						<IoClose className="text-xl text-gray-500 dark:text-gray-400" />
					</button>
				</div>

				{/* Content */}
				<div className="max-h-[70vh] overflow-y-auto p-6">
					{/* Room name input */}
					<div className="mb-6">
						<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Tên phòng (tùy chọn)
						</label>
						<TextInput
							className="w-full"
							placeHolder="Nhập tên phòng..."
							onChange={(e) => {
								createChatRoomRequestRef.current.chatRoomName = e.target.value;
							}}
							focus={true}
						/>
					</div>

					{/* Friends section */}
					<div className="mb-4">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-medium text-gray-800 dark:text-white">
								Thêm thành viên
							</h3>
							<button
								onClick={() => setSearchVisible(!searchVisible)}
								className="cursor-pointer rounded-full p-2 text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
							>
								<IoSearchCircleOutline className="text-3xl" />
							</button>
						</div>

						<AnimatePresence>
							{searchVisible && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 'auto' }}
									exit={{ opacity: 0, height: 0 }}
									className="my-3 flex items-center gap-2"
								>
									<TextInput
										className="flex-1"
										placeHolder="Tìm kiếm bạn bè..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
									<button
										onClick={() => {
											setSearchVisible(false);
											setSearchQuery('');
										}}
										className="cursor-pointer p-2 text-gray-500 transition-colors hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
									>
										<MdClear className="text-xl" />
									</button>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{/* Friends list */}
					<div className="mt-4 space-y-2">
						{filteredFriends.length > 0 ? (
							filteredFriends.map((friend) => (
								<SelectableFriendItem
									key={friend.username}
									friend={friend}
									onSelect={(username) => {
										createChatRoomRequestRef.current.friends.add(username);
									}}
									onRemove={(username) => {
										createChatRoomRequestRef.current.friends.delete(username);
									}}
								/>
							))
						) : (
							<div className="py-6 text-center text-gray-500 dark:text-gray-400">
								<MdPersonAdd className="mx-auto mb-2 text-4xl opacity-60" />
								<p>Không tìm thấy bạn bè nào</p>
							</div>
						)}
					</div>
				</div>

				{/* Footer buttons */}
				<div className="flex border-t border-gray-200 p-4 dark:border-gray-700">
					<button
						className="flex-1 cursor-pointer rounded-lg px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
						onClick={onClose}
					>
						Hủy
					</button>
					<button
						className="ml-3 flex-1 cursor-pointer rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white shadow-md shadow-indigo-500/20 transition-colors hover:bg-indigo-700"
						onClick={handleCreateChatRoom}
					>
						Tạo phòng
					</button>
				</div>
			</motion.div>
		</motion.div>
	);
}
