'use client';

import { useWebSocket } from '@/hooks/useWebSocket';

export default function Page() {
	useWebSocket('/user/queue/chat', (message) => {
		// just a comment to commit
		console.log(message);
	});

	return <div>ChatPage</div>;
}
