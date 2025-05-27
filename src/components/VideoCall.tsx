'use client';

import { useRef, useState } from 'react';
import { useWebRTCSignaling } from '@/hooks/useWebRTCSignaling';
import { SignalMessage } from '@/types/types';

const iceConfig = {
	iceServers: [
		{ urls: 'stun:stun.l.google.com:19302' },
		// {
		//     urls: 'turn:yourserver.com:3478',
		//     username: 'user',
		//     credential: 'pass'
		// }
	],
};

export default function VideoCall({
	selfId,
	targetId,
	onClose,
}: {
	selfId: string | undefined;
	targetId: string;
	onClose: () => void;
}) {
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const remoteVideoRef = useRef<HTMLVideoElement>(null);
	const pcRef = useRef<RTCPeerConnection | null>(null);
	const [inCall, setInCall] = useState(false);

	const { sendSignal } = useWebRTCSignaling({
		selfId,
		targetId,
		onSignal: async (msg) => {
			if (msg.type === 'offer') {
				await handleReceiveOffer(msg);
			} else if (msg.type === 'answer') {
				await pcRef.current?.setRemoteDescription(
					new RTCSessionDescription(msg.sdp!),
				);
			} else if (msg.type === 'candidate') {
				const candidate = new RTCIceCandidate(msg.candidate!);
				await pcRef.current?.addIceCandidate(candidate);
			}
		},
	});

	const handleReceiveOffer = async (msg: SignalMessage) => {
		setInCall(true);
		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true,
		});
		if (localVideoRef.current) {
			localVideoRef.current.srcObject = stream;
		}

		const pc = new RTCPeerConnection(iceConfig);
		pcRef.current = pc;

		pc.onicecandidate = (e) => {
			if (e.candidate) {
				sendSignal({
					type: 'candidate',
					target: msg.caller,
					candidate: e.candidate,
				});
			}
		};

		pc.ontrack = (e) => {
			if (remoteVideoRef.current) {
				remoteVideoRef.current.srcObject = e.streams[0];
			}
		};

		stream.getTracks().forEach((track) => pc.addTrack(track, stream));

		await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp!));
		const answer = await pc.createAnswer();
		await pc.setLocalDescription(answer);

		sendSignal({
			type: 'answer',
			target: msg.caller,
			sdp: answer,
		});
	};

	const startCall = async () => {
		setInCall(true);

		if (
			typeof navigator.mediaDevices === 'undefined' ||
			typeof navigator.mediaDevices.getUserMedia === 'undefined'
		) {
			console.error('Media devices not supported in this browser.');
			return;
		}

		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true,
		});
		if (localVideoRef.current) {
			localVideoRef.current.srcObject = stream;
		}

		const pc = new RTCPeerConnection(iceConfig);
		pcRef.current = pc;

		pc.onicecandidate = (e) => {
			if (e.candidate) {
				sendSignal({
					type: 'candidate',
					target: targetId,
					candidate: e.candidate,
				});
			}
		};

		pc.ontrack = (e) => {
			if (remoteVideoRef.current) {
				remoteVideoRef.current.srcObject = e.streams[0];
			}
		};

		stream.getTracks().forEach((track) => pc.addTrack(track, stream));

		const offer = await pc.createOffer();
		await pc.setLocalDescription(offer);

		sendSignal({
			type: 'offer',
			target: targetId,
			sdp: offer,
		});
	};

	return (
		<div className="fixed inset-0">
			<div
				className="overlay absolute inset-0 cursor-pointer bg-black/70"
				onClick={onClose}
			></div>

			<div className="absolute top-1/2 left-1/2 flex h-full -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center p-4">
				{!inCall && (
					<button
						className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
						onClick={startCall}
					>
						Start Video Call
					</button>
				)}
				<div className="mt-4 flex gap-4 rounded-2xl">
					<video
						ref={localVideoRef}
						autoPlay
						playsInline
						muted
						className="w-1/2 rounded bg-slate-600 shadow"
					/>
					<video
						ref={remoteVideoRef}
						autoPlay
						playsInline
						className="w-1/2 rounded bg-slate-600 shadow"
					/>
				</div>
			</div>
		</div>
	);
}
