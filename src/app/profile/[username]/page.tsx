'use client';

import { useEffect, useState, use } from 'react';
import { useRequest } from '@/hooks/useRequest';
import { UserInfo } from '@/types/User';
import { FiCamera, FiEdit, FiLink, FiMapPin, FiCalendar } from 'react-icons/fi';
import Skeleton from '@/components/Loading/Skeleton';

export default function Page({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const { username } = use(params);
	const { get } = useRequest();
	const [user, setUser] = useState<UserInfo | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getUser = async () => {
			try {
				setIsLoading(true);
				const data = await get('users/info/', {
					params: {
						username: username,
					},
				});
				setUser(data);
			} catch (error) {
				console.error('Failed to fetch user data:', error);
			} finally {
				setIsLoading(false);
			}
		};
		getUser();
	}, [username]);

	return (
		<div className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-900">
			{/* Cover Photo */}
			<div className="relative h-64 w-full overflow-hidden md:h-80">
				{isLoading ? (
					<Skeleton height="100%" className="rounded-none" />
				) : user?.coverPicture ? (
					<img
						src={user.coverPicture}
						alt="Cover"
						className="h-full w-full object-cover"
					/>
				) : (
					<div className="h-full w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"></div>
				)}

				{/* Edit Cover Button */}
				<button className="group absolute right-4 bottom-4 rounded-full bg-white/80 p-2.5 backdrop-blur-sm transition-all duration-300 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-700">
					<FiCamera className="text-gray-700 group-hover:text-purple-600 dark:text-gray-300 dark:group-hover:text-purple-400" />
				</button>
			</div>

			{/* Profile Content */}
			<div className="relative z-10 mx-auto -mt-16 max-w-4xl px-4 sm:px-6 md:-mt-24 lg:px-8">
				{/* Avatar Section */}
				<div className="flex flex-col items-center gap-6 pb-6 md:flex-row md:items-end">
					<div className="relative">
						<div className="relative h-32 w-32 overflow-hidden rounded-full bg-white ring-4 ring-white md:h-40 md:w-40 dark:bg-gray-800 dark:ring-gray-900">
							{isLoading ? (
								<Skeleton circle height="100%" className="rounded-full" />
							) : user?.avatar ? (
								<img
									src={user.avatar}
									alt={user.username}
									className="h-full w-full object-cover"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-cyan-400 to-blue-500">
									<span className="text-4xl font-bold text-white">
										{user?.username?.charAt(0).toUpperCase()}
									</span>
								</div>
							)}
						</div>
						<button className="group absolute right-2 bottom-2 rounded-full bg-white/80 p-2 backdrop-blur-sm transition-all duration-300 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-700">
							<FiCamera className="text-sm text-gray-700 group-hover:text-purple-600 dark:text-gray-300 dark:group-hover:text-purple-400" />
						</button>
					</div>

					{/* User Info */}
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
									{user?.username}
								</h1>
								<p className="mt-1 text-gray-600 dark:text-gray-400">
									@{user?.username}
								</p>
							</>
						)}

						{/* Action Buttons */}
						<div className="mt-4 flex justify-center gap-3 md:justify-start">
							<button className="flex transform items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-purple-500/25">
								<FiEdit size={14} />
								Edit Profile
							</button>
							<button className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600">
								Message
							</button>
						</div>
					</div>
				</div>

				{/* Bio and Details */}
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
							<p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
								{user?.bio || "This user hasn't written a bio yet."}
							</p>

							{/* Details */}
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
									<span>Joined April 2023</span>
								</div>
							</div>

							{/* Stats */}
							<div className="mt-6 flex gap-6 border-t border-gray-100 pt-6 dark:border-gray-700">
								<div className="text-center">
									<div className="text-2xl font-bold text-gray-900 dark:text-white">
										128
									</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										Posts
									</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-gray-900 dark:text-white">
										3.2K
									</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										Followers
									</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-gray-900 dark:text-white">
										458
									</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										Following
									</div>
								</div>
							</div>
						</>
					)}
				</div>

				{/* Content Tabs */}
				<div className="mt-6 border-b border-gray-200 dark:border-gray-700">
					<nav className="flex space-x-8">
						<button className="border-b-2 border-purple-500 px-1 py-4 text-sm font-medium text-purple-600 dark:text-purple-400">
							Posts
						</button>
						<button className="border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
							Media
						</button>
						<button className="border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
							Likes
						</button>
					</nav>
				</div>

				{/* Posts Grid (Placeholder) */}
				<div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{[1, 2, 3, 4, 5, 6].map((item) => (
						<div
							key={item}
							className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
						>
							<div className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30"></div>
							<div className="p-4">
								<h3 className="font-medium text-gray-900 dark:text-white">
									Post Title #{item}
								</h3>
								<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								</p>
								<div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-500">
									<span>April 15, 2023</span>
									<span className="mx-2">•</span>
									<span>5 min read</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
