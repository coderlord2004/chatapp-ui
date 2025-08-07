import React, { useEffect, useState, useRef } from 'react';
import Spinner from './Spinner';
import { MdPersonAddAlt1 } from 'react-icons/md';
import { useRequest } from '@/hooks/useRequest';

type Props = {
	chatGroupId: number | null;
	onClose: () => void;
};

type UserSearchResult = {
	id: number;
	username: string;
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
			<div className="absolute top-1/4 left-1/2 flex h-auto w-[90%] translate-x-[-50%] translate-y-[-50%] transform flex-col items-center justify-center gap-[10px] overflow-y-auto sm:w-[300px]">
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

				{userSearchResults &&
					(searchUserLoading ? (
						<Spinner />
					) : userSearchResults.length !== 0 ? (
						userSearchResults.map((user) => (
							<div
								key={user.id}
								className="flex w-full items-center justify-between rounded-[8px] bg-slate-700 p-[10px]"
							>
								<p>{user.username}</p>
								<div
									className="cursor-pointer"
									onClick={() => sendInvitation(user.username)}
								>
									<MdPersonAddAlt1 />
								</div>
							</div>
						))
					) : (
						<div className="w-full text-center">No results!</div>
					))}
			</div>
		</div>
	);
}
