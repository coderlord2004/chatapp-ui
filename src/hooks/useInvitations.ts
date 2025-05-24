import { useRequest } from '@/hooks/useRequest';
import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import { Invitation } from '@/types/types'
import { useAuth } from '@/contexts/AuthContext';

export default function useInvitations() {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const { get } = useRequest();
    const { accessToken } = useAuth();
    const webSocketPath = `/user/queue/invitations/`;

    useEffect(() => {
        async function getChatRoomMessage() {
            const data = await get(`invitations/`);

            setInvitations(data);
        }
        getChatRoomMessage();
    }, [accessToken, get]);

    useWebSocket(webSocketPath, (message) => {
        console.log('invitation: ', message)
        setInvitations((prev) => [message as Invitation, ...prev]);
    });

    return invitations;
}
