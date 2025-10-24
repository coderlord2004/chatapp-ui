import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatRoomInfo } from '@/types/ChatRoom';
import Avatar from './Avatar';
import Switch from './Switch';
import { useRequest } from '@/hooks/useRequest';
import { useAuth } from '@/contexts/AuthContext';

type Props = {
	chatRoom: ChatRoomInfo;
	onClose: () => void;
};

export default function ChatRoomDetail({ chatRoom, onClose }: Props) {
	const { authUser } = useAuth();
	const chatRoomInfoBox = useRef<HTMLDivElement | null>(null);
	const { post } = useRequest();

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (
				chatRoomInfoBox.current &&
				chatRoomInfoBox.current.contains(e.target as Node)
			)
				return;
			onClose();
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	async function handleUpdatePermission() {
		if (authUser?.id !== chatRoom.leader?.id) return;
		await post(`chatroom/update-permission/?roomId=${chatRoom.id}`);
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
		>
			<motion.div
				ref={chatRoomInfoBox}
				initial={{ opacity: 0, x: 400, scale: 0.9 }}
				animate={{ opacity: 1, x: 0, scale: 1 }}
				exit={{ opacity: 0, x: 400, scale: 0.9 }}
				transition={{
					type: 'spring',
					damping: 25,
					stiffness: 300,
					duration: 0.4,
				}}
				className="absolute top-0 right-0 h-full w-full max-w-md bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-2xl"
			>
				{/* Header */}
				<div className="relative border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-6">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-2xl font-bold text-transparent">
								Thông tin nhóm
							</h2>
							<p className="mt-1 text-sm text-purple-200/80">
								{chatRoom.members.length} thành viên
							</p>
						</div>
						<motion.button
							whileHover={{ scale: 1.1, rotate: 90 }}
							whileTap={{ scale: 0.9 }}
							className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
							onClick={onClose}
						>
							<svg
								className="h-6 w-6 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</motion.button>
					</div>
				</div>

				{/* Room Info */}
				<div className="border-b border-white/10 p-6">
					<div className="flex items-center space-x-4">
						<div className="relative">
							<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-xl font-bold text-white shadow-lg">
								{chatRoom.name?.charAt(0) || 'G'}
							</div>
							<div className="absolute -right-1 -bottom-1 h-6 w-6 rounded-full border-2 border-slate-900 bg-green-500"></div>
						</div>
						<div className="flex-1">
							<h3 className="text-lg font-semibold text-white">
								{chatRoom.name || 'Group Chat'}
							</h3>
							<p className="text-sm text-purple-200/70">
								{chatRoom.type === 'GROUP' ? 'Nhóm chat' : 'Tin nhắn riêng tư'}
							</p>
						</div>
					</div>
				</div>

				{/* Members List */}
				<div className="flex-1 overflow-y-auto p-6">
					<h3 className="mb-4 flex items-center text-lg font-semibold text-white">
						<span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
							Thành viên
						</span>
						<span className="ml-2 rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-300">
							{chatRoom.members.length}
						</span>
					</h3>

					<div className="space-y-3 overflow-y-auto">
						{chatRoom.members.map((user, index) => (
							<motion.div
								key={user.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/10"
							>
								<div className="flex items-center space-x-3">
									<div className="relative">
										<Avatar
											author={user.username}
											src={user.avatar}
											className="h-12 w-12 ring-2 ring-purple-500/30 transition-all duration-300 group-hover:ring-purple-500/50"
										/>
										<div className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-slate-900 bg-green-400"></div>
									</div>
									<div>
										<p className="font-medium text-white transition-colors group-hover:text-purple-100">
											{user.username}
										</p>
										<p className="text-xs text-purple-200/60">Đang hoạt động</p>
									</div>
								</div>

								{chatRoom.type === 'GROUP' && (
									<div
										className={`rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm ${
											chatRoom.leader?.id === user.id
												? 'border border-amber-500/30 bg-amber-500/20 text-amber-300'
												: 'border border-slate-500/30 bg-slate-500/20 text-slate-300'
										}`}
									>
										{chatRoom.leader?.id === user.id
											? 'Trưởng nhóm'
											: 'Thành viên'}
									</div>
								)}
							</motion.div>
						))}
					</div>
				</div>

				{/* Admin Controls */}
				{authUser?.id === chatRoom.leader?.id && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
						className="border-t border-white/10 bg-gradient-to-r from-purple-600/10 to-pink-600/10 p-6 backdrop-blur-sm"
					>
						<div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
							<div className="flex-1">
								<p className="text-sm font-semibold text-white">
									Chỉ admin được gửi tin
								</p>
								<p className="mt-1 text-xs text-purple-200/60">
									{chatRoom.leaderOnlySend
										? 'Chỉ trưởng nhóm có thể gửi tin nhắn'
										: 'Tất cả thành viên đều có thể gửi tin nhắn'}
								</p>
							</div>
							<Switch
								defaultValue={chatRoom.leaderOnlySend}
								onChange={handleUpdatePermission}
							/>
						</div>
					</motion.div>
				)}

				{/* Gradient Overlay */}
				<div className="pointer-events-none absolute right-0 bottom-0 left-0 h-20 bg-gradient-to-t from-slate-900 to-transparent"></div>
			</motion.div>
		</motion.div>
	);
}
