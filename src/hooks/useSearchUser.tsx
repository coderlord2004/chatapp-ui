'use client';

import {
	createContext,
	type PropsWithChildren,
	SetStateAction,
	useContext,
	useEffect,
	useState,
	useRef,
} from 'react';
import SearchUser from '@/components/SearchUser';

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
	setSearchUserModal: () => {},
});

export function SearchUserProvider({ children }: PropsWithChildren) {
	const [searchUserModal, setSearchUserModal] = useState<SearchUserState>({
		isOpen: false,
		chatGroupId: null,
	});

	return (
		<SearchUserContext.Provider value={{ searchUserModal, setSearchUserModal }}>
			{children}
			{searchUserModal.isOpen && (
				<SearchUser
					chatGroupId={searchUserModal.chatGroupId}
					onClose={() =>
						setSearchUserModal({
							isOpen: false,
							chatGroupId: null,
						})
					}
				/>
			)}
		</SearchUserContext.Provider>
	);
}

export function useSearchUser() {
	const context = useContext(SearchUserContext);
	return context || null;
}
