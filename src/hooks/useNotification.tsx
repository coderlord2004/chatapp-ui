'use client';

import React, {
	useContext,
	useState,
	createContext,
	useCallback,
	PropsWithChildren,
} from 'react';
import Notification from '@/components/Notification';

type NotificationType = {
	id: number;
	message: string;
	type: 'success' | 'error' | 'info';
};

type NotificationContextType = {
	showNotification: (notification: Omit<NotificationType, 'id'>) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined,
);

export const NotificationProvider = ({ children }: PropsWithChildren) => {
	const [notifications, setNotifications] = useState<NotificationType[]>([]);

	const showNotification = useCallback(
		(notification: Omit<NotificationType, 'id'>) => {
			const id = Date.now();
			const newNotification: NotificationType = {
				...notification,
				id,
			};

			setNotifications((prev) => [...prev, newNotification]);

			setTimeout(() => {
				setNotifications((prev) => prev.filter((n) => n.id !== id));
			}, 4000);
		},
		[],
	);

	const removeNotification = (id: number) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	};

	return (
		<NotificationContext.Provider value={{ showNotification }}>
			{children}
			<div className="fixed top-4 right-4 z-[2000] space-y-2">
				{notifications.map((notification) => (
					<Notification
						key={notification.id}
						{...notification}
						onClose={removeNotification}
					/>
				))}
			</div>
		</NotificationContext.Provider>
	);
};

export const useNotification = () => {
	const context = useContext(NotificationContext);

	if (!context) {
		throw new Error(
			'useNotification must be used within a NotificationProvider',
		);
	}

	return context;
};
