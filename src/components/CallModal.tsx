'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRequest } from '@/hooks/useRequest';
import { CallInvitation } from '@/types/Invitation';
import { UserWithAvatar } from '@/types/User';

import { IoCall } from 'react-icons/io5';
import { MdClear } from 'react-icons/md';
import { IoMdPersonAdd, IoMdMicOff, IoMdMic } from 'react-icons/io';
import { LuCamera, LuCameraOff } from 'react-icons/lu';

import {
	LocalUser,
	RemoteUser,
	useIsConnected,
	useJoin,
	useLocalMicrophoneTrack,
	useLocalCameraTrack,
	usePublish,
	useRemoteUsers,
} from 'agora-rtc-react';

type CallModalProps = {
	roomId: number | null | undefined;
	isUseVideo: boolean;
	members: UserWithAvatar[];
	callInvitation: CallInvitation | null;
	onClose: () => void;
};

const avatarColors = [
	'#FFB6C1', // light pink
	'#FFD700', // gold
	'#87CEFA', // light sky blue
	'#90EE90', // light green
	'#FFA07A', // light salmon
	'#DDA0DD', // plum
	'#00CED1', // dark turquoise
	'#F4A460', // sandy brown
	'#E6E6FA', // lavender
	'#FFDEAD', // navajo white
];

export default function CallModal({
	roomId,
	isUseVideo,
	members,
	callInvitation,
	onClose,
}: CallModalProps) {
	const AGORA_APP_ID: string = process.env.NEXT_PUBLIC_AGORA_APP_ID || '';
	const { authUser } = useAuth();
	const { get, post } = useRequest();
	const authUserId = authUser?.id;
	const [isLoading, setLoading] = useState<boolean>(true);

	const [calling, setCalling] = useState<boolean>(
		callInvitation ? true : false,
	);
	const isConnected = useIsConnected();
	console.log('connected:', isConnected);
	const [micOn, setMic] = useState<boolean>(true);
	const [cameraOn, setCamera] = useState<boolean>(isUseVideo);
	const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
	const { localCameraTrack } = useLocalCameraTrack(cameraOn);
	usePublish([localMicrophoneTrack, localCameraTrack]);

	// keep actual tracks enabled/disabled in sync with state
	useEffect(() => {
		try {
			if (localMicrophoneTrack) {
				// Agora local audio track API: setEnabled(true|false)
				(localMicrophoneTrack as any).setEnabled?.(micOn);
			}
		} catch (err) {
			console.warn('Failed to set microphone state', err);
		}
	}, [localMicrophoneTrack, micOn]);

	useEffect(() => {
		try {
			if (localCameraTrack) {
				// Agora local video track API: setEnabled(true|false)
				(localCameraTrack as any).setEnabled?.(cameraOn);
				if (cameraOn) {
					// ensure preview is playing if there's a local container
					// LocalUser component handles playback, so generally not necessary here
				}
			}
		} catch (err) {
			console.warn('Failed to set camera state', err);
		}
	}, [localCameraTrack, cameraOn]);

	// keyboard shortcuts: M -> toggle mic, C -> toggle camera
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			// ignore when typing in inputs or textareas or contenteditable
			const target = e.target as HTMLElement | null;
			if (
				target &&
				(target.tagName === 'INPUT' ||
					target.tagName === 'TEXTAREA' ||
					target.isContentEditable)
			)
				return;
			if (e.key === 'm' || e.key === 'M') {
				e.preventDefault();
				setMic((p) => !p);
			}
			if (e.key === 'c' || e.key === 'C') {
				e.preventDefault();
				setCamera((p) => !p);
			}
		};

		document.addEventListener('keydown', handler);
		return () => document.removeEventListener('keydown', handler);
	}, []);

	const remoteUsers = useRemoteUsers();
	console.log('remote user:', remoteUsers);

	async function getAgoraTokenAndInitChannel() {
		const result = await get('agora/token', {
			params: {
				channelName: `room_${roomId}`,
				uid: authUserId,
			},
		});

		return {
			appid: AGORA_APP_ID,
			channel: `room_${roomId}`,
			token: result.token,
			uid: authUserId,
		};
	}

	async function handleCancelCall() {
		if (!roomId) return;

		onClose();
		await post('call/invitation/cancel/', {
			channelId: roomId,
		});
	}

	useEffect(() => {
		if (!callInvitation && calling) {
			async function sendInvitationToChannel() {
				await post('call/invitation/send/', {
					channelId: roomId,
					isUseVideo: isUseVideo,
				});
			}

			sendInvitationToChannel();
		}
	}, [calling]);

	useJoin(getAgoraTokenAndInitChannel, calling);

	return (
		<div className="fixed inset-0 flex flex-col items-center justify-center gap-[10px] p-[10px]">
			{/* connection status */}
			<div className="absolute top-6 left-1/2 z-40 w-full max-w-[640px] -translate-x-1/2 text-center">
				<span
					className={`inline-block rounded-md px-3 py-1 text-sm ${isConnected ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'}`}
				>
					{isConnected
						? 'Connected'
						: calling
							? 'Connecting...'
							: 'Disconnected'}
				</span>
			</div>
			{isConnected ? (
				<div className="flex flex-1 flex-wrap justify-center gap-5 p-4 pt-4 md:p-10">
					<div className="animate-fade-in relative aspect-[4/3] w-full transform overflow-hidden rounded-xl border border-gray-600 bg-black shadow-md transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl sm:w-[288px]">
						<LocalUser
							audioTrack={localMicrophoneTrack}
							cameraOn={cameraOn}
							micOn={micOn}
							videoTrack={localCameraTrack}
							cover={authUser?.avatar || '/next_chat_logo.jpg'}
						>
							<samp className="absolute bottom-[5px] left-[50%] z-20 box-border inline-flex translate-x-[-50%] transform items-center gap-1 rounded-t-md bg-black/70 px-1 text-center text-2xl leading-5 text-white">
								Bạn
							</samp>
						</LocalUser>
					</div>

					{remoteUsers.map((user) => (
						<div
							key={user.uid}
							className="animate-fade-in relative aspect-[4/3] w-full transform overflow-hidden rounded-xl border border-gray-600 bg-black shadow-md transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl sm:w-[288px]"
						>
							<RemoteUser cover="/next_chat_logo.jpg" user={user}>
								<samp className="absolute bottom-[5px] left-[50%] z-20 box-border inline-flex translate-x-[-50%] transform items-center gap-1 rounded-t-md bg-black/70 px-1 text-sm leading-5 text-white">
									{user.uid}
								</samp>
							</RemoteUser>
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-wrap items-center justify-center gap-[10px]">
					{members.map((user) => (
						<div
							key={user.id}
							className="flex h-[250px] w-[300px] items-center justify-center rounded-[8px] bg-slate-700"
						>
							<div
								className="flex h-[150px] w-[150px] items-center justify-center rounded-[50%] text-3xl"
								style={{
									backgroundColor: `${avatarColors[Math.floor(Math.random() * avatarColors.length)]}`,
								}}
							>
								{user.username.substring(0, 1).toUpperCase()}
							</div>
						</div>
					))}
				</div>
			)}

			<div className="flex items-center justify-center gap-[10px] text-4xl">
				{calling ? (
					<div className="flex gap-[7px]">
						<div className="text-3xl">
							<IoMdPersonAdd />
						</div>
					</div>
				) : (
					<button
						className="cursor-pointer rounded-[8px] bg-green-500"
						onClick={() => setCalling(true)}
					>
						<IoCall />
					</button>
				)}

				{/* mic toggle */}
				<button
					aria-label={micOn ? 'Turn off microphone' : 'Turn on microphone'}
					onClick={() => setMic((p) => !p)}
					className={`cursor-pointer rounded-[8px] p-2 ${micOn ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-200'}`}
				>
					{micOn ? <IoMdMic /> : <IoMdMicOff />}
				</button>

				{/* camera toggle */}
				<button
					aria-label={cameraOn ? 'Turn off camera' : 'Turn on camera'}
					onClick={() => setCamera((p) => !p)}
					className={`cursor-pointer rounded-[8px] p-2 ${cameraOn ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-200'}`}
				>
					{cameraOn ? <LuCamera /> : <LuCameraOff />}
				</button>

				<button
					className="cursor-pointer rounded-[8px] bg-red-500"
					onClick={() => handleCancelCall()}
				>
					<MdClear />
				</button>
			</div>

			<div className="overlay absolute inset-0 z-[-1] bg-black/60"></div>
		</div>
	);
}
