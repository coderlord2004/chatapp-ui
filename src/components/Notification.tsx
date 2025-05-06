'use client'

import React from 'react'
import { IoMdClose } from "react-icons/io";
import { IoWarning } from "react-icons/io5";
import { IoNotifications } from "react-icons/io5";

type NotificationProps = {
    id: number
    type: 'success' | 'error' | 'info'
    message: string,
    onClose: (id: number) => void
}

export default function Notification({ id, type, message, onClose }: NotificationProps) {
    const borderColor = (type === 'success') ? 'green' : type === 'error' ? 'red' : 'blue'

    return (
        <div
            className="min-w-[200px] p-3 rounded shadow bg-white  text-black flex items-center gap-x-[7px] relative"
            style={{
                borderLeft: `5px solid ${borderColor}`
            }}
        >
            {(type === 'error') ? (
                <IoWarning style={{
                    width: '25px',
                    height: '25px',
                    color: 'yellow'
                }} />
            ) : (
                <IoNotifications style={{
                    width: '25px',
                    height: '25px',
                    color: 'green'
                }} />
            )}
            <p className="text-sm">{message}</p>
            <button
                className='w-auto h-auto absolute top-[0px] right-[0px] cursor-pointer'
                onClick={() => onClose(id)}
            >
                <IoMdClose style={{
                    width: '20px',
                    height: '20px'
                }} />
            </button>
        </div>
    )
}
