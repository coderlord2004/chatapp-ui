import React, { useState } from 'react';
import { CallInvitation } from '@/types/types';
import CallModal from '@/components/CallModal';
import Avatar from './Avatar';
import { useRequest } from '@/hooks/useRequest';
import { TiTick } from 'react-icons/ti';
import { MdClear } from 'react-icons/md';

type Props = {
	callInvitation: CallInvitation | null;
	onClose: () => void;
};

export default function CallAlert({ callInvitation, onClose }: Props) {
	const [isAccepted, setIsAccepted] = useState<boolean>(false);
	const { post } = useRequest();

	const refuseCallInvitation = async () => {
		await post('call/invitation/refuse/', {
			params: {
				caller: callInvitation?.caller.username,
			},
		});

		onClose();
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/70">
			{isAccepted ? (
				<CallModal
					roomId={callInvitation?.channelId}
					isUseVideo={callInvitation?.isUseVideo || false}
					membersUsername={callInvitation?.membersUsername || []}
					callInvitation={callInvitation}
					onClose={onClose}
				/>
			) : (
				<div className="flex flex-col items-center justify-center gap-[10px] text-4xl">
					<div>
						<Avatar src={callInvitation?.caller.avatar} className="" />
						{callInvitation?.caller.username} đã gọi cho bạn
					</div>

					<div className="flex items-center justify-center gap-[10xp]">
						<button
							className="cursor-pointer rounded-[8px] bg-green-500"
							onClick={() => setIsAccepted(true)}
						>
							<TiTick />
						</button>

						<button
							className="cursor-pointer rounded-[8px] bg-red-500"
							onClick={refuseCallInvitation}
						>
							<MdClear />
						</button>
					</div>

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
