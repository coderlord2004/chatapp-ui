import React, { useState, useEffect, useRef, useDeferredValue } from 'react';
import { useRequest } from '@/hooks/useRequest';
import { FaUserCircle } from 'react-icons/fa';
import { FaUserFriends } from 'react-icons/fa';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { ChatRoomInfo, Invitation } from '@/types/types';
import { useJwtDecoded } from '@/contexts/AuthContext';
import Spinner from './Spinner';
import { MdPersonAddAlt1 } from 'react-icons/md';

type SideBarProps = {
	chatRoomActive: ChatRoomInfo | null;
	onUpdateChatRoomActive: (activeValue: ChatRoomInfo) => void;
};

type UserSearchResult = {
	id: number;
	username: string;
};

function useSearchResult(keyword: string) {
	const [searchUserLoading, setSearchUserLoading] = useState<boolean>(false);
	const [searchResult, setSearchResult] = useState<UserSearchResult[]>([]);
	const [searchKeyword, setSearchKeyword] = useState<string>(keyword);

	const { get } = useRequest();

	useEffect(() => {
		const timer = setTimeout(() => {
			setSearchKeyword(keyword);
		}, 700);

		return () => clearTimeout(timer);
	}, [keyword]);

	useEffect(() => {
		async function getSearchResult() {
			setSearchUserLoading(true);
			const result = await get(`users/search/`, {
				params: { q: searchKeyword },
			});
			setSearchResult(result);
			setSearchUserLoading(false);
		}

		getSearchResult();
	}, [get, searchKeyword]);

	return { searchResult, searchUserLoading };
}

export function SideBar(props: SideBarProps) {
	const { get, post } = useRequest();
	const [invitations, setInvitation] = useState<Invitation[] | null>(null);
	const [isShowInvitations, setShowInvitations] = useState<boolean>(false);
	const [isSearchingUserName, setSearchingUsername] = useState<boolean>(false);
	const [chatRooms, setChatRooms] = useState<ChatRoomInfo[]>([]);
	const sideBarRef = useRef<HTMLDivElement>(null);
	const jwt = useJwtDecoded();
	const currentUsername = jwt?.sub;

	const [keyword, setKeyword] = useState<string>('');
	const { searchResult: userSearchResults, searchUserLoading } =
		useSearchResult(keyword);
	console.log('userSearchResults:', userSearchResults);

	function getChatRoomName(info: ChatRoomInfo) {
		const { membersUsername, name } = info;
		if (name) {
			return name;
		}
		console.log('membersUsername:', membersUsername);
		return membersUsername
			.filter((username) => username !== currentUsername)
			.join(', ');
	}

	const sendInvitation = async (receiverName: string, chatGroupId = null) => {
		await post('invitations/', {
			receiverUserName: receiverName,
			chatGroupId: chatGroupId,
		});
	};

	const startResize = (e: React.MouseEvent) => {
		e.preventDefault();
		const box = sideBarRef.current;
		if (!box) return;

		const startX = e.clientX;
		const startWidth = box.offsetWidth;

		const handleMouseMove = (e: MouseEvent) => {
			box.style.width = `${startWidth + (e.clientX - startX)}px`;
		};

		const stopResize = () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', stopResize);
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', stopResize);
	};

	useEffect(() => {
		const getChatRoom = async () => {
			const results = await Promise.all([
				get('chatrooms/'),
				get('invitations/'),
			]);
			setChatRooms(results[0]);
			setInvitation(results[1]);
		};
		getChatRoom();
	}, [get]);

	return (
		<div
			ref={sideBarRef}
			className="relative z-10 flex w-64 min-w-[200px] flex-col border-r border-gray-700 bg-gray-800"
		>
			<div className="flex items-center justify-between border-b border-gray-700 p-4">
				<h2 className="gradientColor">NextChat</h2>
				<div className="flex items-center justify-center gap-[14px]">
					<div className="relative transition-all duration-200 hover:scale-[1.05] hover:transform hover:text-yellow-400">
						<div
							className="relative"
							onClick={() => setShowInvitations(!isShowInvitations)}
						>
							{invitations && invitations.length && (
								<div className="absolute top-[-70%] right-[-70%] flex h-[20px] w-[20px] items-center justify-center rounded-[50%] bg-red-500 text-[80%]">
									{invitations.length}
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
											className="min-w-[200px] rounded-[5px] bg-gray-900 p-[5px] text-white"
										>
											{invitation.sender}
										</div>
									))
								) : (
									<div>No invitations.</div>
								)}
							</div>
						)}
					</div>
					<div
						className="transition-all duration-200 hover:scale-[1.05] hover:transform hover:text-yellow-400"
						onClick={() => setSearchingUsername(!isSearchingUserName)}
					>
						<IoIosAddCircleOutline
							style={{
								fontSize: '130%',
								cursor: 'pointer',
							}}
						/>
					</div>
				</div>
			</div>

			{isSearchingUserName && (
				<div className="fixed inset-0 z-[1000]">
					<div
						className="h-full w-full cursor-pointer bg-black/80"
						onClick={() => setSearchingUsername(!isSearchingUserName)}
					></div>
					<div className="absolute top-1/2 left-1/2 flex w-full translate-x-[-50%] translate-y-[-50%] transform flex-col items-center justify-center gap-[10px] sm:w-[300px]">
						<form className="w-full border-[1px] border-solid border-slate-600">
							<input
								type="text"
								name="searchingUsername"
								placeholder="Nhập username..."
								className="w-full p-[8px] outline-none"
								onChange={(e) => setKeyword(e.target.value)}
								required
							/>
						</form>
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

			<div className="flex-1 overflow-y-auto">
				{chatRooms.length ? (
					chatRooms.map((chatRoom) => (
						<div
							key={chatRoom.id}
							onClick={() => props.onUpdateChatRoomActive(chatRoom)}
							className={`mx-2 my-1 flex cursor-pointer items-center rounded-lg p-3 transition-all duration-200 ${
								chatRoom === props.chatRoomActive
									? 'bg-indigo-600'
									: 'hover:bg-gray-700'
							}`}
						>
							{chatRoom.avatar ? (
								<img
									src={chatRoom.avatar}
									alt=""
									className="h-8 w-8 rounded-full object-cover"
								/>
							) : (
								<FaUserCircle className="h-8 w-8 text-gray-400" />
							)}
							<div className="ml-3 overflow-hidden">
								<p className="truncate font-medium">
									{getChatRoomName(chatRoom)}
								</p>
								{chatRoom.type === 'DUO' && (
									<p className="text-xs text-gray-400">
										{chatRoom.membersUsername.length} members
									</p>
								)}
							</div>
						</div>
					))
				) : (
					<div className="p-4 text-center text-gray-400">
						No chat rooms available
					</div>
				)}
			</div>

			<div
				onMouseDown={startResize}
				className="absolute top-0 right-0 h-full w-[2px] cursor-ew-resize bg-gray-700"
			/>
		</div>
	);
}
