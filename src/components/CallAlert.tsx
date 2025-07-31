import React, { useState } from 'react'
import { CallInvitation } from '@/types/types'
import CallModal from '@/components/CallModal';
import { TiTick } from "react-icons/ti";
import { MdClear } from "react-icons/md";

type Props = {
    callInvitation: CallInvitation;
    onClose: () => void;
}

export default function CallAlert({ callInvitation, onClose }: Props) {
    const [isAccepted, setIsAccepted] = useState<boolean>(false)

    return (
        <div>
            <div className="flex gap-[10px] text-4xl">
                <button
                    className="bg-green-500 cursor-pointer rounded-[8px]"
                    onClick={() => setIsAccepted(true)}
                >
                    <TiTick />
                </button>

                <button
                    className='bg-red-500 cursor-pointer rounded-[8px]'
                    onClick={onClose}
                >
                    <MdClear />
                </button>
            </div>

            {isAccepted && (
                <CallModal
                    roomId={callInvitation.chatRoom.id}
                    isUseVideo={callInvitation.video}
                    membersUsername={callInvitation.chatRoom.membersUsername}
                    callInvitation={callInvitation}
                    onClose={onClose}
                />
            )}
        </div>
    )
}