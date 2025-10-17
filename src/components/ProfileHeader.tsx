'use client';
import Link from 'next/link';
import Avatar from '@/components/Avatar';
import Skeleton from '@/components/Loading/Skeleton';
import { IoMdPersonAdd } from 'react-icons/io';
import { routes } from '@/lib/routes';
import { UserInfo } from '@/types/User';
import { useAuth } from '@/contexts/AuthContext';

type Props = {
	userData: UserInfo;
	isLoading: boolean;
	username: string;
};

export default function ProfileHeader({
	userData,
	isLoading,
	username,
}: Props) {
	const { authUser } = useAuth();

	return (
		<div className="relative flex flex-col items-center gap-6 pb-6 md:flex-row md:items-end">
			<div className="avatar relative">
				<div className="relative h-32 w-32 md:h-40 md:w-40">
					{isLoading ? (
						<Skeleton circle height="100%" className="rounded-full" />
					) : userData.avatar ? (
						<Avatar
							author={userData.username}
							src={userData.avatar}
							className="h-full w-full"
							square
							controls
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-cyan-400 to-blue-500">
							<span className="text-4xl font-bold text-white">
								{userData.username.charAt(0).toUpperCase()}
							</span>
						</div>
					)}
				</div>
			</div>

			<div className="flex-1 text-center md:text-left">
				{isLoading ? (
					<>
						<Skeleton
							width={200}
							height={30}
							className="mx-auto mb-2 md:mx-0"
						/>
						<Skeleton width={150} height={24} className="mx-auto md:mx-0" />
					</>
				) : (
					<>
						<h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
							{userData.username}
						</h1>
						<p className="mt-1 text-gray-600 dark:text-gray-400">
							@{userData.username}
						</p>
					</>
				)}

				<div className="mt-4 flex justify-center gap-3 md:justify-start">
					{authUser?.username === username ? (
						<>
							<button className="flex transform items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-purple-500/25">
								Chỉnh sửa hồ sơ
							</button>
							<Link
								href={routes.nextchat}
								className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600"
							>
								Nhắn tin với bạn bè
							</Link>
						</>
					) : (
						<>
							<button className="flex transform items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-purple-500/25">
								Kết bạn
								<IoMdPersonAdd size={14} />
							</button>
							<Link
								href={routes.message(username)}
								className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600"
							>
								Nhắn tin
							</Link>
						</>
					)}
					<Link
						href={routes.nextvibes}
						className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600"
					>
						Lướt mạng xã hội
					</Link>
				</div>
			</div>
		</div>
	);
}
