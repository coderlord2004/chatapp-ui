import useNotificationListener from '@/hooks/useNotificationListener';
import { useState, useRef, useEffect } from 'react';
import { IoIosNotifications } from 'react-icons/io';
import { AnimatePresence, motion } from 'framer-motion';
import Avatar from './Avatar';

type Props = {};

export default function NotificationIcon({}: Props) {
	const notificationBox = useRef<HTMLDivElement | null>(null);
	const [showNotifications, setShowNotifications] = useState(false);
	const { notifications, deleteNotification } = useNotificationListener();

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				notificationBox.current &&
				!notificationBox.current.contains(event.target as Node)
			) {
				setShowNotifications(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [notificationBox]);

	return (
		<div className="relative">
			<div
				onClick={() => setShowNotifications(true)}
				className="cursor-pointer text-3xl text-white"
			>
				<IoIosNotifications />
			</div>

			<AnimatePresence>
				{showNotifications && (
					<motion.div
						ref={notificationBox}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						transition={{ duration: 0.2 }}
						className="absolute top-[100%] right-[100%] z-50 max-h-[400px] w-[300px] rounded-lg bg-gradient-to-b from-slate-500 to-slate-700 p-4 shadow-lg"
					>
						{notifications.length > 0 ? (
							<div className="flex w-full flex-col gap-[10px] overflow-y-auto">
								{notifications.map((notification) => (
									<div
										key={notification.id}
										className="flex items-center justify-between gap-[10px] rounded-[7px] bg-slate-700 p-2"
									>
										<Avatar
											author={notification.sender.username}
											src={notification.sender.avatar}
											className="h-8 w-8"
										/>
										<div className="flex flex-col">
											<p className="text-[120%] font-bold">
												{notification.sender.username}
											</p>
											<p>{notification.content}</p>
										</div>
										<button
											className="cursor-pointer text-sm text-red-500 hover:underline"
											onClick={() => deleteNotification(notification.id)}
										>
											Xóa
										</button>
									</div>
								))}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center py-8 text-gray-500">
								<div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
									<IoIosNotifications className="text-2xl text-amber-400" />
								</div>
								<p className="text-sm">Chưa có thông báo nào</p>
								<p className="mt-1 text-xs">
									Các thông báo mới sẽ xuất hiện ở đây
								</p>
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
