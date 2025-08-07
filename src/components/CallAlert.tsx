import React, { useState } from 'react';
import { CallInvitation } from '@/types/types';
import CallModal from '@/components/CallModal';
import { TiTick } from 'react-icons/ti';
import { MdClear } from 'react-icons/md';

type Props = {
	callInvitation: CallInvitation | null;
	onClose: () => void;
};

export default function CallAlert({ callInvitation, onClose }: Props) {
	const [isAccepted, setIsAccepted] = useState<boolean>(false);

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/70">
			{isAccepted ? (
				<CallModal
					roomId={callInvitation?.chatRoomDto.id}
					isUseVideo={callInvitation?.video || false}
					membersUsername={[]}
					callInvitation={callInvitation}
					onClose={onClose}
				/>
			) : (
				<div className="flex items-center justify-center gap-[10px] text-4xl">
					<button
						className="cursor-pointer rounded-[8px] bg-green-500"
						onClick={() => setIsAccepted(true)}
					>
						<TiTick />
					</button>

					<button
						className="cursor-pointer rounded-[8px] bg-red-500"
						onClick={onClose}
					>
						<MdClear />
					</button>

					<audio
						src="/nhac_chuong_iphone-www_tiengdong_com.mp3"
						autoPlay
						className="hidden"
					>
						Your browser does not support the audio element.
					</audio>
				</div>
			)}
		</div>
	);
}
