'use client';

import useWebSocket from '@/hooks/useWebSocket';

export default function Page() {
	useWebSocket('/user/queue/chat', (message) => {
		console.log(message);
	});

	return <div>ChatPage</div>;
}
