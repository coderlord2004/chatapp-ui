import React, { useState, useRef, useEffect } from 'react'
import { useRequest } from '@/hooks/useRequest';
import { useAuth } from '@/contexts/AuthContext';
import { decodeJwt } from 'jose';
import useMessages from '@/hooks/useMessages';
import { FaUserCircle, FaPaperPlane } from "react-icons/fa";

type ChatRoomProps = {
    chatRoomInfo: {
        id: number,
        name: string,
        avatar: undefined | string | Blob,
        membersUsername: [],
        type: 'GROUP' | 'DUO',
        createdOn: Date
    }
}

export default function ChatRoom({ chatRoomInfo }: ChatRoomProps) {
    const [newMessage, setNewMessage] = useState('');
    const roomId = chatRoomInfo.id;
    const { accessToken } = useAuth();
    const decodedJwt = accessToken && decodeJwt(accessToken);
    const { post } = useRequest()
    const messages = useMessages(`${roomId}`);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    console.log('username:', decodedJwt?.sub)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
        <div className="flex-1 flex flex-col bg-gray-900">
            {/* Chat Header */}
            <div className="flex items-center p-4 border-b border-gray-800 bg-gray-800/50">
                {chatRoomInfo.avatar ? (
                    <img
                        src={chatRoomInfo.avatar}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                    />
                ) : (
                    <FaUserCircle className="w-10 h-10 text-gray-400" />
                )}
                <div className="ml-3">
                    <h2 className="font-semibold">{chatRoomInfo.name}</h2>
                    {chatRoomInfo.type === 'DUO' && (
                        <p className="text-xs text-gray-400">
                            {chatRoomInfo.membersUsername.length} members online
                        </p>
                    )}
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900/50">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${decodedJwt && decodedJwt.sub === msg.sender
                            ? "justify-end"
                            : "justify-start"
                            }`}
                    >
                        <div
                            className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 transition-all duration-150 ${decodedJwt && decodedJwt.sub === msg.sender
                                ? "bg-indigo-600 rounded-br-none"
                                : "bg-gray-800 rounded-bl-none"
                                }`}
                            style={{
                                opacity: 0,
                                transform: 'translateY(10px)',
                                animation: 'fadeInUp 0.3s forwards',
                                animationDelay: `${idx === messages.length - 1 ? '0.1s' : '0s'}`
                            }}
                        >
                            {decodedJwt && decodedJwt.sub !== msg.sender && (
                                <p className="text-xs font-semibold text-indigo-300 mb-1">
                                    {msg.sender}
                                </p>
                            )}
                            <p className="text-gray-100">{msg.message}</p>
                        </div>
                    </div>
                ))}
                {/* Empty div for auto-scrolling */}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-800 bg-gray-800/50">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 rounded-lg bg-gray-700 border border-gray-600 px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
                    >
                        <FaPaperPlane />
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}