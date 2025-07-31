import { useRequest } from '@/hooks/useRequest';
import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import { Invitation } from '@/types/types';

function useInvitations() {
	const [invitations, setInvitations] = useState<Invitation[]>([]);
	const { get } = useRequest();
	const webSocketPath = `/user/queue/invitations/`;

	useEffect(() => {
		async function fetchInvitations() {
			const data = await get(`invitations/`);
			setInvitations(data);
		}
		fetchInvitations();
	}, [get]);

	useWebSocket(webSocketPath, (message) => {
		console.log('sender invitation: ', message)
		setInvitations((prev) => [message as Invitation, ...prev]);
	});

	function updateInvitationStatus(id: number, status: 'ACCEPTED' | 'REJECTED') {
		setInvitations((prev) =>
			prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)),
		);
	}

	return {
		invitations,
		updateInvitationStatus,
	};
}

function useInvitationReply() {
	const [invitationReply, setInvitationReply] = useState<Invitation | null>(
		null,
	);
	const webSocketPath = `/user/queue/invitationReplies/`;

	useWebSocket(webSocketPath, (message) => {
		console.log('invitation reply response:', message);
		setInvitationReply(message as unknown as Invitation);
	});

	return invitationReply;
}

export { useInvitations, useInvitationReply };
