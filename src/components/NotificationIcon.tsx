import useNotificationListener from "@/hooks/useNotificationListener"
import { useState, useRef, useEffect } from "react";
import { IoIosNotifications } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import Avatar from "./Avatar";

type Props = {
}

export default function NotificationIcon({ }: Props) {
    const notificationBox = useRef<HTMLDivElement | null>(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const { notifications, deleteNotification } = useNotificationListener();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notificationBox.current && !notificationBox.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [notificationBox]);

    return (
        <div className="relative">
            <div
                onClick={() => setShowNotifications(true)}
                className="text-3xl text-white cursor-pointer"
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
                        className="absolute top-[100%] right-[100%] p-4 bg-gradient-to-b from-slate-500 to-slate-700 rounded-lg shadow-lg w-[300px] max-h-[400px] z-50"
                    >
                        {notifications.length > 0 ? (
                            <div className="w-full overflow-y-auto flex flex-col gap-[10px]">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id} className="p-2 flex gap-[10px] justify-between items-center bg-slate-700 rounded-[7px]"
                                    >
                                        <Avatar
                                            author={notification.sender.username}
                                            src={notification.sender.avatar}
                                            className="h-8 w-8"
                                        />
                                        <div className="flex flex-col">
                                            <p className="font-bold text-[120%]">{notification.sender.username}</p>
                                            <p>{notification.content}</p>
                                        </div>
                                        <button
                                            className="text-sm text-red-500 cursor-pointer hover:underline"
                                            onClick={() => deleteNotification(notification.id)}
                                        >Xóa</button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                    <IoIosNotifications className="text-2xl text-amber-400" />
                                </div>
                                <p className="text-sm">Chưa có thông báo nào</p>
                                <p className="text-xs mt-1">Các thông báo mới sẽ xuất hiện ở đây</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}