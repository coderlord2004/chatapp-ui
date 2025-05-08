'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { post } from '@/utils/request';
import { useAuth } from '@/contexts/AuthContext';
import { decodeJwt } from 'jose';
import useMessages from '@/hooks/useMessages';

function useWebSocketPath() {
	const searchParams = useSearchParams();

	let id = searchParams.get('room');
	if (!id) id = '1'; // fallback

	return id;
}

export default function Page() {
	const { accessToken } = useAuth();
	const roomId = useWebSocketPath();

	const [newMessage, setNewMessage] = useState('');
	const decodedJwt = accessToken && decodeJwt(accessToken);

	const messages = useMessages(roomId);

	const sendMessage = async () => {
		if (!newMessage.trim()) {
			// TODO: disable button
			return;
		}

		await post(
			`messages/${roomId}`,
			{ message: newMessage },
			{ headers: { Authorization: `Bearer ${accessToken}` } },
		);

		setNewMessage('');
	};

	return (
		<div className="flex h-screen flex-col p-4">
			<div className="mb-4 flex-1 overflow-y-auto rounded-md border bg-white p-4 text-black shadow">
				{messages.map((msg, idx) => (
					<div
						key={idx}
						className={`mb-2 ${decodedJwt && decodedJwt.sub === msg.sender ? 'text-right' : 'text-left'}`}
					>
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
					className="flex-1 rounded border px-3 py-2"
				/>
				<button
					onClick={sendMessage}
					className="rounded bg-blue-500 px-4 py-2 text-white"
				>
					Gửi
				</button>
			</div>
		</div>
	);
}
