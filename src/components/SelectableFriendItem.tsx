import { motion } from 'framer-motion';
import { useState } from 'react';
import Avatar from './Avatar';
import { UserWithAvatar } from '@/types/User';

type Props = {
	friend: UserWithAvatar;
	onSelect: (username: string) => void;
	onRemove: (username: string) => void;
};

export default function SelectableFriendItem({
	friend,
	onSelect,
	onRemove,
}: Props) {
	const [isSelected, setIsSelected] = useState(false);

	const handleToggle = () => {
		if (isSelected) {
			onRemove(friend.username);
		} else {
			onSelect(friend.username);
		}
		setIsSelected(!isSelected);
	};

	return (
		<motion.div
			whileHover={{ scale: 1.01 }}
			whileTap={{ scale: 0.99 }}
			className={`flex cursor-pointer items-center rounded-xl p-3 transition-colors ${
				isSelected
					? 'border border-indigo-200 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-900/20'
					: 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700'
			}`}
			onClick={handleToggle}
		>
			<Avatar
				redirectByUsername={friend.username}
				src={friend.avatar}
				className="h-10 w-10"
			/>

			<div className="ml-[5px] flex-1">
				<p className="font-medium text-gray-800 dark:text-white">
					{friend.username}
				</p>
			</div>

			<div
				className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
					isSelected
						? 'border-indigo-600 bg-indigo-600'
						: 'border-gray-300 bg-white dark:border-gray-500 dark:bg-gray-600'
				}`}
			>
				<motion.svg
					initial={false}
					animate={{ scale: isSelected ? 1 : 0 }}
					className="h-3 w-3 text-white"
					viewBox="0 0 24 24"
				>
					<path
						fill="currentColor"
						d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
					/>
				</motion.svg>
			</div>
		</motion.div>
	);
}
