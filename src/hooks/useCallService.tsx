import { useState } from 'react';
import { useWebSocket } from './useWebSocket';
import { CallInvitation } from '@/types/Invitation';

type CallModal = {
	isOpen: boolean;
	data: CallInvitation;
};

function useIncomingCallInvitation() {
	const [callModal, setCallModal] = useState<CallModal | null>(null);
	const callInvitationPath = '/user/queue/send_call_invitation';

	useWebSocket(callInvitationPath, (message) => {
		console.log('call invitation: ', message);
		setCallModal({
			isOpen: true,
			data: message as CallInvitation,
		});
	});

	return {
		callModal: callModal,
		onClose: () => setCallModal(null),
	};
}

function useCallInvitationRefused() {
	const [refuser, setRefuser] = useState<string | null>(null);
	const callInvitationPath = '/user/queue/refuse_call_invitation';

	useWebSocket(callInvitationPath, (message) => {
		console.log('call invitation refused: ', message);
		setRefuser((message as Record<string, string>).sender);
	});

	return refuser;
}

function useCancelCallInvitation() {
	const [sender, setSender] = useState<string | null>(null);
	const callInvitationPath = '/user/queue/cancel_call_invitation';

	useWebSocket(callInvitationPath, (message) => {
		console.log('cancel call invitation: ', message);
		setSender((message as Record<string, string>).sender);
	});

	return sender;
}

export {
	useIncomingCallInvitation,
	useCallInvitationRefused,
	useCancelCallInvitation,
};
