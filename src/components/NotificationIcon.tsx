import useNotificationListener from '@/hooks/useNotificationListener';
import { useState, useRef, useEffect } from 'react';
import { IoIosNotifications, IoIosClose } from 'react-icons/io';
import { MdNotificationsActive } from 'react-icons/md';
import { AnimatePresence, motion } from 'framer-motion';
import Avatar from './Avatar';

type Props = {};

export default function NotificationIcon({}: Props) {
	const notificationBox = useRef<HTMLDivElement | null>(null);
	const iconRef = useRef<HTMLDivElement | null>(null);
	const [showNotifications, setShowNotifications] = useState(false);
	const { notifications, deleteNotification } = useNotificationListener();

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				notificationBox.current &&
				notificationBox.current.contains(event.target as Node)
			) {
				return;
			}
			if (iconRef.current && iconRef.current.contains(event.target as Node)) {
				return;
			}
			setShowNotifications(false);
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [notificationBox]);

	return (
		<div className="relative">
			{/* Notification Icon with Badge */}
			<div
				ref={iconRef}
				onClick={() => setShowNotifications((prev) => !prev)}
				className="relative cursor-pointer text-3xl text-white transition-all duration-300 hover:scale-110 hover:text-amber-300"
			>
				<IoIosNotifications />
				{notifications.length > 0 && (
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-xs font-bold text-white shadow-lg"
					>
						{notifications.length > 9 ? '9+' : notifications.length}
					</motion.div>
				)}
			</div>

			<AnimatePresence>
				{showNotifications && (
					<motion.div
						ref={notificationBox}
						initial={{ opacity: 0, scale: 0.9, y: -10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: -10 }}
						transition={{
							duration: 0.2,
							type: 'spring',
							stiffness: 300,
							damping: 25,
						}}
						className="absolute top-[120%] right-0 z-50 max-h-[500px] w-[380px] overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl shadow-black/50 backdrop-blur-lg"
					>
						{/* Header */}
						<div className="border-b border-slate-700/50 bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-indigo-900/50 p-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 p-2">
										<MdNotificationsActive className="text-lg text-white" />
									</div>
									<div>
										<h3 className="text-lg font-bold text-white">Thông báo</h3>
										<p className="text-sm text-slate-300">
											{notifications.length} thông báo mới
										</p>
									</div>
								</div>
								{notifications.length > 0 && (
									<button className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
										Đánh dấu đã đọc
									</button>
								)}
							</div>
						</div>

						<div className="scrollBarStyle max-h-[600px] overflow-y-auto">
							{notifications.length > 0 ? (
								<div className="flex w-full flex-col p-2">
									{notifications.map((notification, index) => (
										<motion.div
											key={notification.id}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: index * 0.1 }}
											className="group relative mb-2 rounded-xl border border-slate-700/30 bg-gradient-to-r from-slate-800/80 to-slate-700/80 p-3 transition-all duration-300 hover:border-slate-600/50 hover:from-slate-700/90 hover:to-slate-600/90 hover:shadow-lg"
										>
											{/* Glow effect on hover */}
											<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

											<div className="relative flex items-start gap-3">
												{/* Avatar with gradient border */}
												<div className="relative">
													<div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 opacity-75 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
													<Avatar
														author={notification.sender.username}
														src={notification.sender.avatar}
														className="relative h-10 w-10 border-2 border-slate-800"
													/>
												</div>

												{/* Content */}
												<div className="min-w-0 flex-1">
													<div className="flex items-start justify-between">
														<div>
															<p className="truncate text-sm font-bold text-white">
																{notification.sender.username}
															</p>
															<p className="mt-1 text-sm leading-relaxed text-slate-300">
																{notification.content}
															</p>
														</div>
														<button
															onClick={() =>
																deleteNotification(notification.id)
															}
															className="ml-2 flex-shrink-0 rounded-full p-1 text-slate-500 transition-colors duration-200 hover:bg-red-500/10 hover:text-red-400"
														>
															<IoIosClose className="text-lg" />
														</button>
													</div>
													<div className="mt-2 flex items-center justify-between">
														<span className="text-xs text-slate-400">
															{new Date().toLocaleTimeString('vi-VN', {
																hour: '2-digit',
																minute: '2-digit',
															})}
														</span>
														<div className="flex gap-2">
															<button className="text-xs font-medium text-amber-400 transition-colors hover:text-amber-300">
																Xem
															</button>
														</div>
													</div>
												</div>
											</div>
										</motion.div>
									))}
								</div>
							) : (
								// Empty State
								<div className="flex flex-col items-center justify-center px-6 py-12 text-center">
									<div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-slate-600/50 bg-gradient-to-br from-slate-700 to-slate-800">
										<IoIosNotifications className="text-3xl text-amber-400/80" />
									</div>
									<h4 className="mb-2 text-lg font-semibold text-white">
										Chưa có thông báo
									</h4>
									<p className="text-sm leading-relaxed text-slate-400">
										Các thông báo mới sẽ xuất hiện ở đây. <br />
										Hãy quay lại sau nhé!
									</p>
								</div>
							)}
						</div>

						{/* Footer */}
						{notifications.length > 0 && (
							<div className="border-t border-slate-700/50 bg-slate-900/50 p-3">
								<button className="w-full rounded-lg py-2 text-center text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white">
									Xem tất cả thông báo
								</button>
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
