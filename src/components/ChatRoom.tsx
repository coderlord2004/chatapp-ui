import React, { useState, useEffect } from 'react'
import { useRequest } from '@/hooks/useRequest';
import { useAuth } from '@/contexts/AuthContext';
import { decodeJwt } from 'jose';
import useMessages from '@/hooks/useMessages';

type ChatRoomProps = {
    chatRoomInfo: {
        id: number,
        name: string,
        avatar: undefined | string | Blob,
        membersUsername: [],
        type: string,
        createdOn: Date
    }
}

export default function ChatRoom({ chatRoomInfo }: ChatRoomProps) {
    const [newMessage, setNewMessage] = useState('');
    const roomId = chatRoomInfo.id;
    const { accessToken } = useAuth();
    const decodedJwt = accessToken && decodeJwt(accessToken);
    const { get, post } = useRequest()

    const messages = useMessages(`${roomId}`);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        await post(
            `messages/${roomId}`,
            {
                message: newMessage
            }
        );

        setNewMessage('');
    };

    return (
        <div className="w-[80%] ml-[20%] flex h-screen flex-col p-4">
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