import React from 'react';
import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import { CallInvitation } from '@/types/types';

type Props = {};

type CallModal = {
	isOpen: boolean;
	data: CallInvitation | null;
};

function useCallService() {
	const [callModal, setCallModal] = useState<CallModal>({
		isOpen: false,
		data: null,
	});
	const callInvitationPath = '/user/queue/call_invitation';

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

export default useCallService;
