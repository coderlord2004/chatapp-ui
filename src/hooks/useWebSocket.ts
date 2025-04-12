import { WebSocketContext } from '@/services/websocket';
import { messageCallbackType } from '@stomp/stompjs';
import { useContext, useEffect } from 'react';

function useWebSocket(destination: string, callback: messageCallbackType) {
	const stompClient = useContext(WebSocketContext);

	useEffect(() => {
		if (stompClient === undefined) {
			return;
		}

		const subscription = stompClient.subscribe(destination, callback);
		return () => {
			subscription.unsubscribe();
		};
	}, [stompClient, destination, callback]);
}

export default useWebSocket;
