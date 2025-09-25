import React, { useEffect, useState, useRef } from 'react';
import Spinner from './Loading/Spinner';
import { MdPersonAddAlt1 } from 'react-icons/md';
import { useRequest } from '@/hooks/useRequest';
import { UserSearchResult } from '@/types/User';
import Avatar from './Avatar';

type Props = {
	chatGroupId: number | null;
	onClose: () => void;
};

export default function SearchUser({ chatGroupId, onClose }: Props) {
	const { get, post } = useRequest();
	const [userSearchResults, setUserSearchResults] = useState<
		UserSearchResult[] | null
	>(null);
	const [searchUserLoading, setSearchUserLoading] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const searchInput = useRef<HTMLInputElement | null>(null);

	const sendInvitation = async (receiverName: string, roomId = null) => {
		await post('invitations/', {
			receiverUserName: receiverName,
			chatGroupId: roomId || chatGroupId,
		});
	};

	useEffect(() => {
		if (searchInput.current) {
			searchInput.current.focus();
		}
	}, []);

	useEffect(() => {
		const delayDebounce = setTimeout(async () => {
			if (searchTerm.trim() === '') {
				setUserSearchResults(null);
				return;
			}

			setSearchUserLoading(true);
			const data = await get(`users/search/`, {
				params: {
					q: searchTerm,
				},
			});
			setUserSearchResults(data);
			setSearchUserLoading(false);
		}, 300);

		return () => clearTimeout(delayDebounce);
	}, [get, searchTerm]);

	return (
		<div className="fixed inset-0 z-[1000] bg-black/80 px-[10px] text-white">
			<div
				className="overlay h-full w-full cursor-pointer"
				onClick={onClose}
			></div>
			<div className="absolute top-1/4 left-1/2 flex h-auto w-[90%] translate-x-[-50%] translate-y-[-50%] transform flex-col items-center justify-center gap-[10px] sm:w-[300px]">
				<div className="flex w-full items-center justify-between border-[1px] border-solid border-slate-600">
					<input
						ref={searchInput}
						type="text"
						name="searchingUsername"
						placeholder="Nhập username..."
						className="w-full p-[8px] outline-none"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>

				<div className="flex w-full flex-col gap-[10px] overflow-y-auto">
					{userSearchResults &&
						(searchUserLoading ? (
							<Spinner />
						) : userSearchResults.length !== 0 ? (
							userSearchResults.map((user) => (
								<div
									key={user.userDto.id}
									className="flex w-full items-center justify-between rounded-[8px] bg-slate-700 px-[10px] py-[7px]"
								>
									<div className="flex items-center justify-center gap-[10px]">
										<Avatar
											src={user.userDto.avatar}
											className="h-[40px] w-[40px]"
											controls={true}
											onClose={onClose}
										/>
										<p>{user.userDto.username}</p>
									</div>

									{user.invitationDto &&
									user.invitationDto.status === 'PENDING' ? (
										<div className="cursor-pointer">Đã gửi kết bạn.</div>
									) : (
										<div
											className="cursor-pointer"
											onClick={() => sendInvitation(user.userDto.username)}
										>
											<MdPersonAddAlt1 />
										</div>
									)}
								</div>
							))
						) : (
							<div className="w-full text-center">No results!</div>
						))}
				</div>
			</div>
		</div>
	);
}
