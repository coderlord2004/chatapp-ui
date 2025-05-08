'use client';

import { useSearchParams } from 'next/navigation';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useEffect, useState } from 'react';
import { get, post } from '@/utils/request'
import { useAuth } from '@/contexts/AuthContext';
import { decodeJwt } from 'jose';

function useWebSocketPath() {
	const [roomId, setRoomId] = useState<string | null>(null);
	const searchParams = useSearchParams();

	useEffect(() => {
		let id = searchParams.get('room');
		if (!id) id = '1'; // fallback
		setRoomId(id);
	}, [searchParams]);

	if (!roomId) return undefined;
	return `/user/queue/chat/${roomId}`;
}

interface Message {
	sender: string;
	message: string;
	timestamp?: string;
}

export default function Page() {
	const webSocketPath = useWebSocketPath();
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState('');
	const { accessToken } = useAuth()
	const roomId = new URLSearchParams(window.location.search).get('room') ?? '1';
	const decodedJwt = accessToken && decodeJwt(accessToken)
	console.log('decodedJwt:', decodedJwt)
	// Lắng nghe tin nhắn mới
	useWebSocket(webSocketPath, (message) => {
		setMessages((prev) => [...prev, message as Message]);
	});

	const sendMessage = async () => {
		if (!newMessage.trim()) return;

		try {
			await post(`messages/${roomId}`, {
				message: newMessage,
			}, {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});
			setNewMessage('');
		} catch (error) {
			console.error('Gửi tin nhắn thất bại:', error);
		}
	};

	useEffect(() => {
		const getChatRoomMessage = async () => {
			try {
				const data = await get(`messages/${roomId}`)
				setMessages(data)
			} catch (err) {
				console.log(err)
			}
		}
		getChatRoomMessage()
	}, [])

	return (
		<div className="flex flex-col h-screen p-4">
			<div className="flex-1 overflow-y-auto border p-4 mb-4 bg-white rounded-md shadow text-black">
				{messages.map((msg, idx) => (
					<div key={idx} className={`mb-2 ${decodedJwt && decodedJwt.sub === msg.sender ? 'text-right' : 'text-left'}`}>
						<strong>{msg.sender}:</strong> {msg.message}
					</div>
				))}
			</div>
			<div className="flex gap-2">
				<input
					type="text"
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
					placeholder="Nhập tin nhắn..."
					className="flex-1 border rounded px-3 py-2"
				/>
				<button
					onClick={sendMessage}
					className="px-4 py-2 bg-blue-500 text-white rounded"
				>
					Gửi
				</button>
			</div>
		</div>
	);
}
