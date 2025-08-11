import { useState } from 'react';
import { useWebSocket } from './useWebSocket';
import { CallInvitation } from '@/types/types';

type CallModal = {
	isOpen: boolean;
	data: CallInvitation | null;
};

function useIncomingCallInvitation() {
	const [callModal, setCallModal] = useState<CallModal>({
		isOpen: false,
		data: null,
	});
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
		onClose: () =>
			setCallModal((prev) => ({
				...prev,
				isOpen: false,
			})),
	};
}

function useCallInvitationRefused() {
	const [callModal, setCallModal] = useState<CallModal>({
		isOpen: false,
		data: null,
	});
	const callInvitationPath = '/user/queue/refuse_call_invitation';

	useWebSocket(callInvitationPath, (message) => {
		console.log('call invitation refused: ', message);
		setCallModal({
			isOpen: true,
			data: message as CallInvitation,
		});
	});

	return {
		callModal: callModal,
		onClose: () =>
			setCallModal((prev) => ({
				...prev,
				isOpen: false,
			})),
	};
}

export { useIncomingCallInvitation, useCallInvitationRefused };
