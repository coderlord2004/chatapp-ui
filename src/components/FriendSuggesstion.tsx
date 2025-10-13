import { useEffect, useState } from 'react';
import { useRequest } from '@/hooks/useRequest';
import { UserWithAvatar } from '@/types/User';
import Avatar from './Avatar';

type Props = {};

type FriendSuggestion = {
	requested: boolean;
	user: UserWithAvatar;
};

export default function FriendSuggesstion({}: Props) {
	const { get, post } = useRequest();
	const [friendSuggestions, setFriendSuggestions] = useState<
		FriendSuggestion[]
	>([]);

	async function addFriend(receiverUserName: string) {
		await post('invitations', { receiverUserName });
		setFriendSuggestions((prev) =>
			prev.map((suggestion) => {
				if (suggestion.user.username === receiverUserName) {
					return { ...suggestion, requested: true };
				}
				return suggestion;
			}),
		);
	}

	useEffect(() => {
		const fetchSuggestions = async () => {
			const data = await get('users/friend-suggestions/', {
				params: { page: 1 },
			});
			const newData: FriendSuggestion[] = data.map((user: UserWithAvatar) => ({
				requested: false,
				user,
			}));
			setFriendSuggestions(newData);
		};
		fetchSuggestions();
	}, []);

	return (
		<div className="text-black dark:text-white">
			<h1>Gợi ý kết bạn</h1>

			<div className="mt-4 flex flex-col gap-2">
				{friendSuggestions.map((f) => (
					<div key={f.user.id} className="mb-4 flex items-center space-x-4">
						<Avatar
							author={f.user.username}
							src={f.user.avatar}
							className="h-10 w-10"
						/>
						<p className="text-sm">{f.user.username}</p>
						{f.requested ? (
							<button
								disabled
								className="ml-auto cursor-not-allowed rounded bg-gray-400 px-3 py-1 text-white"
							>
								Đã gửi lời mời
							</button>
						) : (
							<button
								className="ml-auto rounded bg-blue-500 px-3 py-1 text-white transition hover:bg-blue-600"
								onClick={() => addFriend(f.user.username)}
							>
								Thêm bạn bè
							</button>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
