import { useEffect, useContext } from 'react';
import { WebSocketContext } from '@/hooks/useWebSocket';
import { SignalMessage } from '@/types/types';

type Props = {
	selfId: string | undefined;
	targetId: string;
	onSignal: (msg: SignalMessage) => void;
};

export function useWebRTCSignaling({ selfId, targetId, onSignal }: Props) {
	const context = useContext(WebSocketContext);

	useEffect(() => {
		const { stompClient } = context ?? {};
		if (!stompClient) return;

		const destination = `/user/queue/signaling`;

		const subscription = stompClient.subscribe(destination, (message) => {
			const body = JSON.parse(message.body) as SignalMessage;
			console.log('Received signaling message:', body);
			if (body.caller !== targetId) return;

			onSignal(body);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [context, onSignal, selfId, targetId]);

	const sendSignal = (msg: Omit<SignalMessage, 'caller'>) => {
		const { stompClient } = context ?? {};
		if (!stompClient) return;

		stompClient.publish({
			destination: '/signaling',
			body: JSON.stringify({ ...msg, caller: selfId }),
		});
	};

	return { sendSignal };
}
