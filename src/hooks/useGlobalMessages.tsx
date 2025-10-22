import { useEffect, useState } from 'react';
import { useWebSocket } from './useWebSocket';
import { GlobalMessageResponse } from '@/types/Message';

export default function useGlobalMessages() {
	const [message, setMessage] = useState<GlobalMessageResponse | null>(null);
	const webSocketPath = '/user/queue/chat/main';

	useWebSocket(webSocketPath, (response) => {
		const message = response as GlobalMessageResponse;

		setMessage(message);
	});

	return message;
}
