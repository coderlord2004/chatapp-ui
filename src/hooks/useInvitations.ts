import { useRequest } from '@/hooks/useRequest';
import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import { Invitation } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';

function useInvitations() {
	const [invitations, setInvitations] = useState<Invitation[]>([]);
	const { get } = useRequest();
	const { accessToken } = useAuth();
	const webSocketPath = `/user/queue/invitations/`;

	useEffect(() => {
		async function fetchInvitations() {
			const data = await get(`invitations/`);
			setInvitations(data);
		}
		fetchInvitations();
	}, [accessToken, get]);

	useWebSocket(webSocketPath, (message) => {
		console.log('invitation response:', message);
		setInvitations((prev) => [message as unknown as Invitation, ...prev]);
	});

	const updateInvitationStatus = (
		id: number,
		status: 'ACCEPTED' | 'REJECTED',
	) => {
		setInvitations((prev) =>
			prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)),
		);
	};

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
