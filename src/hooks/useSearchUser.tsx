'use client';

import {
	createContext,
	type PropsWithChildren,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react';
import { useRequest } from '@/hooks/useRequest';
import Spinner from '../components/Spinner';
import { MdPersonAddAlt1 } from 'react-icons/md';

type UserSearchResult = {
	id: number;
	username: string;
};

type SearchUserState = {
	isOpen: boolean;
	chatGroupId: number | null;
};

type SearchUserContextType = {
	searchUserModal: SearchUserState;
	setSearchUserModal: React.Dispatch<SetStateAction<SearchUserState>>;
};

export const SearchUserContext = createContext<SearchUserContextType>({
	searchUserModal: { isOpen: false, chatGroupId: null },
	setSearchUserModal: () => { },
});

export function SearchUserProvider({ children }: PropsWithChildren) {
	const { get, post } = useRequest();
	const [searchUserModal, setSearchUserModal] = useState<SearchUserState>({
		isOpen: false,
		chatGroupId: null,
	});
	const [userSearchResults, setUserSearchResults] = useState<
		UserSearchResult[] | null
	>(null);
	const [searchUserLoading, setSearchUserLoading] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState<string>('');

	const sendInvitation = async (receiverName: string, chatGroupId = null) => {
		await post('invitations/', {
			receiverUserName: receiverName,
			chatGroupId: chatGroupId || searchUserModal.chatGroupId,
		});
	};

	useEffect(() => {
		const delayDebounce = setTimeout(async () => {
			if (searchTerm.trim() === '') {
				setUserSearchResults(null);
				return;
			}

			setSearchUserLoading(true);
			const data = await get(`users/search/`, {
				params: {
					q: searchTerm
				}
			});
			setUserSearchResults(data);
			setSearchUserLoading(false);
		}, 300);

		return () => clearTimeout(delayDebounce);
	}, [get, searchTerm]);

	return (
		<SearchUserContext.Provider value={{ searchUserModal, setSearchUserModal }}>
			{children}
			{searchUserModal.isOpen && (
				<div className="fixed inset-0 z-[1000] bg-black/80 px-[10px] text-white">
					<div
						className="overlay h-full w-full cursor-pointer"
						onClick={() =>
							setSearchUserModal({
								isOpen: false,
								chatGroupId: null,
							})
						}
					></div>
					<div className="absolute top-1/4 left-1/2 flex h-auto w-[90%] translate-x-[-50%] translate-y-[-50%] transform flex-col items-center justify-center gap-[10px] overflow-y-auto sm:w-[300px]">
						<div className="flex w-full items-center justify-between border-[1px] border-solid border-slate-600">
							<input
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
			)}
		</SearchUserContext.Provider>
	);
}

export function useSearchUser() {
	const context = useContext(SearchUserContext);
	return context || null;
}
