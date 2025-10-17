'use client';
import { FiLink, FiMapPin, FiCalendar } from 'react-icons/fi';
import { formatDateTime } from '@/utils/formatDateTime';
import Skeleton from '@/components/Loading/Skeleton';
import { UserInfo } from '@/types/User';

type Props = {
	userData: UserInfo;
	isLoading: boolean;
};

export default function ProfileInfo({ userData, isLoading }: Props) {
	return (
		<div className="mt-6 rounded-xl border border-gray-100 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
			{isLoading ? (
				<>
					<Skeleton count={3} className="mb-2" />
					<div className="mt-4 flex flex-wrap gap-4">
						<Skeleton width={100} height={20} />
						<Skeleton width={100} height={20} />
						<Skeleton width={100} height={20} />
					</div>
				</>
			) : (
				<>
					{userData.bio && (
						<p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
							{userData.bio}
						</p>
					)}

					<div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
						<div className="flex items-center gap-1.5">
							<FiMapPin size={16} />
							<span>Earth</span>
						</div>
						<div className="flex items-center gap-1.5">
							<FiLink size={16} />
							<a
								href="#"
								className="text-purple-600 hover:underline dark:text-purple-400"
							>
								example.com
							</a>
						</div>
						<div className="flex items-center gap-1.5">
							<FiCalendar size={16} />
							<span>Joined {formatDateTime(userData.createdAt)}</span>
						</div>
					</div>

					<div className="mt-6 flex gap-6 border-t border-gray-100 pt-6 dark:border-gray-700">
						{['totalPosts', 'totalFollowers', 'totalFollowing'].map((key) => (
							<div className="text-center" key={key}>
								<div className="text-2xl font-bold text-gray-900 dark:text-white">
									{(userData as any)[key] ?? 0}
								</div>
								<div className="text-sm text-gray-600 dark:text-gray-400">
									{key.replace('total', '')}
								</div>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
}
