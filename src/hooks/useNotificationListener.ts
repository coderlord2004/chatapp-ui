import { useRequest } from '@/hooks/useRequest';
import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import { Notification } from '@/types/Notification';
import { useNotification } from './useNotification';

function useNotificationListener() {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const { showNotification } = useNotification();
	const { get, remove } = useRequest();
	const webSocketPath = `/user/queue/notification/`;

	useEffect(() => {
		async function fetchNotifications() {
			const data = await get(`notification/get-all/`);
			setNotifications(data);
		}
		fetchNotifications();
	}, [get]);

	useWebSocket(webSocketPath, (message) => {
		setNotifications((prev) => [message as Notification, ...prev]);
		showNotification({
			type: 'info',
			message: (message as Notification).content,
		});
	});

	async function deleteNotification(id: number) {
		if (!confirm('Bạn có chắc chắn muốn xóa thông báo này?')) return;

		setNotifications((prev) =>
			prev.filter((notification) => notification.id !== id),
		);
		const res = await remove(`notification/delete/?id=${id}`);
		showNotification({
			type: 'success',
			message: res,
		});
	}

	return {
		notifications,
		deleteNotification,
	};
}

export default useNotificationListener;
