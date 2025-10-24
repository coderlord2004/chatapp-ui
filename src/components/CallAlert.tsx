'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CallInvitation } from '@/types/Invitation';
import CallModal from '@/components/CallModal';
import Avatar from './Avatar';
import { useRequest } from '@/hooks/useRequest';
import { TiTick } from 'react-icons/ti';
import { MdClear } from 'react-icons/md';
import {
	useCallInvitationRefused,
	useCancelCallInvitation,
} from '@/hooks/useCallService';

type Props = {
	callInvitation: CallInvitation;
	onClose: () => void;
};

type RefuseCall = {
	refuser: string;
	onClose: () => void;
};

function RefuseCall({ refuser, onClose }: RefuseCall) {
	useEffect(() => {
		setTimeout(() => {
			onClose();
		}, 2000);
	}, []);

	return <div className="m-auto">{refuser} đã từ chối cuộc gọi.</div>;
}

type CancelCall = {
	sender: string;
	onClose: () => void;
};

function CancelCall({ sender, onClose }: CancelCall) {
	useEffect(() => {
		setTimeout(() => {
			onClose();
		}, 1500);
	}, []);

	return (
		<div className="absolute inset-0 m-auto flex items-center justify-center bg-black/90">
			<span className="text-xl text-amber-400">{sender + ' '}</span> đã hủy cuộc
			gọi
		</div>
	);
}

export default function CallAlert({ callInvitation, onClose }: Props) {
	const [isAccepted, setIsAccepted] = useState<boolean>(false);
	const { post } = useRequest();
	const refuser = useCallInvitationRefused();
	const sender = useCancelCallInvitation();
	const refuseCallInvitation = async () => {
		onClose();
		await post(
			`call/invitation/refuse/?caller=${callInvitation?.caller.username}`,
		);
	};

	return createPortal(
		<div className="fixed inset-0 flex items-center justify-center bg-black/70 text-black dark:text-white">
			{isAccepted ? (
				<CallModal
					roomId={callInvitation?.channelId}
					isUseVideo={callInvitation?.isUseVideo || false}
					members={callInvitation.members}
					callInvitation={callInvitation}
					onClose={onClose}
				/>
			) : (
				<div className="flex flex-col items-center justify-center gap-[10px] text-4xl">
					<div>
						<Avatar
							author={callInvitation?.caller.username}
							src={callInvitation.caller.avatar}
							className=""
							onClose={onClose}
						/>
						<span className="text-amber-400">
							{callInvitation?.caller.username}
						</span>{' '}
						đã gọi cho bạn
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

			{refuser && <RefuseCall refuser={refuser} onClose={onClose} />}

			{sender && <CancelCall sender={sender} onClose={onClose} />}
		</div>,
		document.getElementById('theme') || document.body,
	);
}
