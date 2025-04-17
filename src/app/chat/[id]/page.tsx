'use client';

import { useWebSocket } from '@/hooks/useWebSocket';
import { use } from 'react';

type Props = {
	params: Promise<{ id: string }>;
};

export default function Page(props: Props) {
	const params = use(props.params);
	const webSocketPath = `/user/queue/chat/${params.id}`;
	console.log(webSocketPath);

	useWebSocket(webSocketPath, (message) => {
		console.log(message);
	});

	return <div>ChatPage</div>;
}
