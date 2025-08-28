'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRequest } from '@/hooks/useRequest';
import { CallInvitation } from '@/types/types';

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
	membersUsername: string[];
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
	membersUsername,
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
					{membersUsername.map((username) => (
						<div
							key={username}
							className="flex h-[250px] w-[300px] items-center justify-center rounded-[8px] bg-slate-700"
						>
							<div
								className="flex h-[150px] w-[150px] items-center justify-center rounded-[50%] text-3xl"
								style={{
									backgroundColor: `${avatarColors[Math.floor(Math.random() * avatarColors.length)]}`,
								}}
							>
								{username.substring(0, 1).toUpperCase()}
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

				<button
					className="cursor-pointer rounded-[8px] bg-red-500"
					onClick={onClose}
				>
					<MdClear />
				</button>
			</div>

			<div className="overlay absolute inset-0 z-[-1] bg-black/60"></div>
		</div>
	);
}

// 'use client';

// import { useRef, useState, useCallback } from 'react';
// import { useWebRTCSignaling } from '@/hooks/useWebRTCSignaling';
// import { SignalMessage } from '@/types/types';
// import { useNotification } from '@/hooks/useNotification';
// import { MdCallEnd } from 'react-icons/md';
// import { IoMdClose } from 'react-icons/io';

// const iceConfig = {
// 	iceServers: [
// 		{ urls: 'stun:stun.l.google.com:19302' },
// 		{
// 			urls: 'turn:relay1.expressturn.com:3480',
// 			username: '000000002066046148',
// 			credential: 's0j+DngvJr3dBUO30zdh9AqQLi4=',
// 		},
// 	],
// };

// interface CallModalProps {
// 	isMounted: boolean;
// 	onMounted: () => void;
// 	selfId: string | undefined;
// 	targetId: string;
// 	onClose: () => void;
// }

// export default function CallModal({
// 	isMounted,
// 	onMounted,
// 	selfId,
// 	targetId,
// 	onClose,
// }: CallModalProps) {
// 	const localVideoRef = useRef<HTMLVideoElement>(null);
// 	const remoteVideoRef = useRef<HTMLVideoElement>(null);
// 	const pcRef = useRef<RTCPeerConnection | null>(null);
// 	const { showNotification } = useNotification();
// 	const [isStartCall, setIsStartCall] = useState<boolean>(false);
// 	const [isShowMe, setIsShowMe] = useState<boolean>(true);

// 	const { sendSignal } = useWebRTCSignaling({
// 		selfId,
// 		targetId,
// 		onSignal: async (msg) => {
// 			if (msg.type === 'offer') {
// 				await handleReceiveOffer(msg);
// 			} else if (msg.type === 'answer') {
// 				await pcRef.current?.setRemoteDescription(
// 					new RTCSessionDescription(msg.sdp!),
// 				);
// 			} else if (msg.type === 'candidate') {
// 				const candidate = new RTCIceCandidate(msg.candidate!);
// 				await pcRef.current?.addIceCandidate(candidate);
// 			}
// 		},
// 	});

// 	const checkMediaDevicesSupport = useCallback(() => {
// 		if (
// 			typeof navigator.mediaDevices === 'undefined' ||
// 			typeof navigator.mediaDevices.getUserMedia === 'undefined'
// 		) {
// 			showNotification({
// 				type: 'error',
// 				message: 'Media devices not supported in this browser.',
// 			});
// 			return false;
// 		}
// 		return true;
// 	}, [showNotification]);

// 	const handleReceiveOffer = async (msg: SignalMessage) => {
// 		if (!checkMediaDevicesSupport()) return;

// 		const stream = await navigator.mediaDevices.getUserMedia({
// 			video: false,
// 			audio: true,
// 		});
// 		if (localVideoRef.current) {
// 			localVideoRef.current.srcObject = stream;
// 		}

// 		const pc = new RTCPeerConnection(iceConfig);

// 		pcRef.current = pc;

// 		pc.onicecandidate = (e) => {
// 			if (e.candidate) {
// 				sendSignal({
// 					type: 'candidate',
// 					target: msg.caller,
// 					candidate: e.candidate,
// 				});
// 			}
// 		};

// 		pc.ontrack = (e) => {
// 			if (remoteVideoRef.current) {
// 				remoteVideoRef.current.srcObject = e.streams[0];
// 			}
// 		};

// 		stream.getTracks().forEach((track) => {
// 			console.log('track: ', track);
// 			pc.addTrack(track, stream);
// 		});

// 		await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp!));
// 		const answer = await pc.createAnswer();
// 		await pc.setLocalDescription(answer);

// 		sendSignal({
// 			type: 'answer',
// 			target: msg.caller,
// 			sdp: answer,
// 		});
// 	};

// 	const startCall = async () => {
// 		if (!checkMediaDevicesSupport()) return;

// 		const stream = await navigator.mediaDevices.getUserMedia({
// 			video: false,
// 			audio: true,
// 		});
// 		if (localVideoRef.current) {
// 			localVideoRef.current.srcObject = stream;
// 		}

// 		const pc = new RTCPeerConnection(iceConfig);
// 		console.log('pc: ', pc)
// 		pcRef.current = pc;

// 		pc.onicecandidate = (e) => {
// 			if (e.candidate) {
// 				sendSignal({
// 					type: 'candidate',
// 					target: targetId,
// 					candidate: e.candidate,
// 				});
// 			}
// 		};

// 		pc.ontrack = (e) => {
// 			if (remoteVideoRef.current) {
// 				remoteVideoRef.current.srcObject = e.streams[0];
// 			}
// 		};

// 		stream.getTracks().forEach((track) => pc.addTrack(track, stream));

// 		const offer = await pc.createOffer();
// 		await pc.setLocalDescription(offer);

// 		sendSignal({
// 			type: 'offer',
// 			target: targetId,
// 			sdp: offer,
// 		});
// 	};

// 	return (
// 		<div className={`fixed inset-0 ${isMounted ? '' : 'hidden'}`}>
// 			<div
// 				className="overlay absolute inset-0 cursor-pointer bg-black/70"
// 				onClick={onClose}
// 			></div>

// 			<div className="absolute top-1/2 left-1/2 flex h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center gap-[10px] p-4 sm:h-[80%] sm:w-[80%]">
// 				<div className="relative flex w-full flex-1 gap-4 rounded-2xl">
// 					{isShowMe && (
// 						<div className="absolute top-4 right-4 w-[40%] rounded bg-slate-900 shadow sm:relative sm:top-0 sm:right-0 sm:w-[calc(100%/2-8px)] sm:bg-slate-800 sm:shadow-[0_0_3px_3px_gray]">
// 							<video
// 								ref={localVideoRef}
// 								autoPlay
// 								playsInline
// 								muted
// 								className=""
// 							/>
// 							<div
// 								className="absolute top-2 right-2 flex cursor-pointer text-[20px] hover:text-red-500 sm:hidden"
// 								onClick={() => setIsShowMe(!isShowMe)}
// 							>
// 								<IoMdClose />
// 							</div>
// 						</div>
// 					)}
// 					<div className="w-full rounded bg-slate-800 shadow-[0_0_3px_3px_gray] sm:w-[calc(100%/2-8px)]">
// 						<video ref={remoteVideoRef} autoPlay playsInline className="" />
// 					</div>
// 				</div>

// 				<div className="flex gap-[10px]">
// 					{!isStartCall && (
// 						<div
// 							className="box-border flex cursor-pointer items-center justify-center rounded-[8px] bg-blue-500 p-[5px]"
// 							onClick={() => {
// 								setIsStartCall(!isStartCall);
// 								startCall();
// 							}}
// 						>
// 							Call now!
// 						</div>
// 					)}
// 					<div
// 						className="flex w-[60px] cursor-pointer items-center justify-center rounded-[10px] bg-red-500 text-[30px] text-white"
// 						onClick={onMounted}
// 					>
// 						<MdCallEnd />
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }
