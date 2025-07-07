"use client";

import React, { useEffect, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

const APP_ID = "f5aaad68939a4279876790a674790b94";
const CHANNEL = "test-channel"; // có thể là bất kỳ string nào
const TOKEN = null; // dùng null nếu không bật App Certificate

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

export default function VideoCall() {
	const localVideoRef = useRef<HTMLDivElement>(null);
	const remoteVideoRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const init = async () => {
			const uid = await client.join(APP_ID, CHANNEL, TOKEN || null);

			const localTrack = await AgoraRTC.createMicrophoneAndCameraTracks();
			localTrack[1].play(localVideoRef.current!);
			await client.publish(localTrack);

			client.on("user-published", async (user, mediaType) => {
				await client.subscribe(user, mediaType);
				if (mediaType === "video") {
					user.videoTrack?.play(remoteVideoRef.current!);
				}
			});
		};

		init();

		return () => {
			client.leave();
		};
	}, []);

	return (
		<div className="flex gap-4">
			<div ref={localVideoRef} className="w-1/2 h-64 bg-black" />
			<div ref={remoteVideoRef} className="w-1/2 h-64 bg-black" />
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

// interface VideoCallProps {
// 	isMounted: boolean;
// 	onMounted: () => void;
// 	selfId: string | undefined;
// 	targetId: string;
// 	onClose: () => void;
// }

// export default function VideoCall({
// 	isMounted,
// 	onMounted,
// 	selfId,
// 	targetId,
// 	onClose,
// }: VideoCallProps) {
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
