'use client';

import { useSearchParams } from 'next/navigation';

import { useWebSocket } from '@/hooks/useWebSocket';
import { useEffect, useState } from 'react';

function useWebSocketPath() {
	const [roomId, setRoomId] = useState<string | null>(null);
	const searchParams = useSearchParams();

	useEffect(() => {
		let id = searchParams.get('room');

		// TODO: fetch first id and assign to this
		if (id === null) {
			id = '1';
		}

		setRoomId(id);
	}, [searchParams]);

	if (roomId === null) {
		return undefined;
	}

	return `/user/queue/chat/${roomId}`;
}

export default function Page() {
	const webSocketPath = useWebSocketPath();
	useWebSocket(webSocketPath, (message) => {
		console.log(message);
	});

	return <div>ChatPage</div>;
}
