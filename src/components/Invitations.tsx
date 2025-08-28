import React, { useState } from 'react';
import { useInvitations } from '@/hooks/useInvitations';
import { useRequest } from '@/hooks/useRequest';
import { ChatRoomInfo } from '@/types/types';

import { TiTick } from 'react-icons/ti';
import { IoClose } from 'react-icons/io5';
import { FaUserFriends, FaUserCircle } from 'react-icons/fa';

type Props = {
	onUpdateChatRooms: (c: ChatRoomInfo) => void;
};

export default function Invitations({ onUpdateChatRooms }: Props) {
	const { patch } = useRequest();
	const { invitations, updateInvitationStatus } = useInvitations();
	const [isShowInvitations, setShowInvitations] = useState<boolean>(false);
	const handleInvitation = async (invitationId: number, isAccept: boolean) => {
		updateInvitationStatus(invitationId, isAccept ? 'ACCEPTED' : 'REJECTED');

		if (isAccept) {
			const senderInvitation = invitations.find(
				(invitation) => invitation.id === invitationId,
			);
			if (!senderInvitation) return;

			const newChatRoom: ChatRoomInfo = {
				id: senderInvitation.chatRoomId,
				name: null,
				avatar: senderInvitation.sender.avatar,
				membersUsername: [
					senderInvitation.sender.username,
					senderInvitation.receiver.username,
				],
				type: senderInvitation.chatRoomId ? 'GROUP' : 'DUO',
				createdOn: Date.now().toString(),
				latestMessage: null,
			};

			onUpdateChatRooms(newChatRoom);
		}

		await patch(`invitations/${invitationId}`, {
			accept: isAccept,
		});
	};
	const getTotalNewInvitations = () => {
		return invitations.filter((i) => i.status === 'PENDING').length;
	};
	const totalNewInvitations = getTotalNewInvitations();

	return (
		<div className="relative">
			<div
				className="relative transition-all duration-200 hover:scale-[1.05] hover:transform hover:text-yellow-400"
				onClick={() => setShowInvitations(!isShowInvitations)}
			>
				{totalNewInvitations !== 0 && (
					<div className="absolute top-[-70%] right-[-70%] flex h-[20px] w-[20px] items-center justify-center rounded-[50%] bg-red-500 text-[80%]">
						{totalNewInvitations}
					</div>
				)}
				<FaUserFriends
					style={{
						fontSize: '120%',
						cursor: 'pointer',
					}}
				/>
			</div>

			{isShowInvitations && (
				<div className="absolute top-[100%] left-1/2 flex translate-x-[-50%] transform flex-col gap-[5px] rounded-[8px] border-gray-500 bg-gray-700 p-4">
					{invitations ? (
						invitations.map((invitation) => (
							<div
								key={invitation.id}
								className="flex min-w-[200px] items-center justify-between rounded-[5px] bg-gray-900 p-[5px] text-white"
							>
								{invitation.sender.avatar ? (
									<img
										src={invitation.sender.avatar}
										alt=""
										className="h-[25px] w-[25px]"
									/>
								) : (
									<FaUserCircle className="text-[25px]" />
								)}
								<p>{invitation.sender.username}</p>
								{invitation.status === 'PENDING' ? (
									<div className="flex items-center justify-center">
										<div
											className="transform cursor-pointer text-[25px] transition-all duration-200 hover:scale-[1.1] hover:text-[lightgreen]"
											onClick={() => handleInvitation(invitation.id, true)}
										>
											<TiTick />
										</div>
										<div
											className="cursor-pointer text-[25px] transition-all duration-200 hover:scale-[1.1] hover:transform hover:text-red-600"
											onClick={() => handleInvitation(invitation.id, false)}
										>
											<IoClose />
										</div>
									</div>
								) : (
									<div className="flex items-center justify-center rounded-[5px] bg-blue-500 px-[5px] text-xs">
										{invitation.status === 'ACCEPTED' ? (
											<>
												<p>Accepted</p>
												<TiTick className="text-[25px] text-green-500" />
											</>
										) : (
											<>
												<p>Rejected</p>
												<IoClose
													style={{
														fontSize: '25px',
														color: 'red',
													}}
												/>
											</>
										)}
									</div>
								)}
							</div>
						))
					) : (
						<div>No invitations.</div>
					)}
				</div>
			)}
		</div>
	);
}
