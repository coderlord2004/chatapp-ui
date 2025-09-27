'use client';

import { useEffect, useState, use } from 'react';
import { useRequest } from '@/hooks/useRequest';
import { UserInfo } from '@/types/User';
import { PostType } from '@/types/Post';
import { FiCamera, FiEdit, FiLink, FiMapPin, FiCalendar } from 'react-icons/fi';
import { IoMdPersonAdd } from 'react-icons/io';
import Skeleton from '@/components/Loading/Skeleton';
import { useAuth } from '@/contexts/AuthContext';
import Post from '@/components/Post';
import Link from 'next/link';

type ProfileType = {
	user: UserInfo | null;
	posts: PostType[];
};

export default function Page({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const { username } = use(params);
	const { get } = useRequest();
	const [profile, setProfile] = useState<ProfileType>({
		user: null,
		posts: [],
	});
	const [page, setPage] = useState<number>(1);
	const [isLoading, setIsLoading] = useState(true);
	const { authUser } = useAuth();

	useEffect(() => {
		const getUser = async () => {
			const data = await get('users/info/', {
				params: {
					username: username,
				},
			});
			setIsLoading(false);
			setProfile((prev) => ({
				...prev,
				user: data,
			}));
		};
		if (authUser && authUser.username !== username) {
			getUser();
		} else if (authUser && authUser.username === username) {
			setIsLoading(false);
			setProfile((prev) => ({
				...prev,
				user: authUser,
			}));
		}
	}, [username]);

	useEffect(() => {
		const getPosts = async () => {
			const data = await get(`posts/get/${username}`, {
				params: {
					page: page,
				},
			});
			setProfile((prev) => ({
				...prev,
				posts: data,
			}));
		};
		getPosts();
	}, [username, page]);

	return (
		<div className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-900">
			{/* Cover Photo */}
			<div className="relative h-64 w-full overflow-hidden md:h-80">
				{isLoading ? (
					<Skeleton height="100%" className="rounded-none" />
				) : profile.user?.coverPicture ? (
					<img
						src={profile.user.coverPicture}
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
							) : profile.user?.avatar ? (
								<img
									src={profile.user.avatar}
									alt={profile.user.username}
									className="h-full w-full object-cover"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-cyan-400 to-blue-500">
									<span className="text-4xl font-bold text-white">
										{profile.user?.username?.charAt(0).toUpperCase()}
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
									{profile.user?.username}
								</h1>
								<p className="mt-1 text-gray-600 dark:text-gray-400">
									@{profile.user?.username}
								</p>
							</>
						)}

						{/* Action Buttons */}
						<div className="mt-4 flex justify-center gap-3 md:justify-start">
							{authUser?.username === username ? (
								<button className="flex transform cursor-pointer items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-purple-500/25">
									<FiEdit size={14} />
									Chỉnh sửa hồ sơ
								</button>
							) : (
								<button className="flex transform cursor-pointer items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-purple-500/25">
									Kết bạn
									<IoMdPersonAdd size={14} />
								</button>
							)}
							<Link
								href={`/nextchat`}
								className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600"
							>
								Nhắn tin
							</Link>
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
							{profile.user && (
								<p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
									{profile.user.bio}
								</p>
							)}

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
										{profile.user?.totalPosts}
									</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										Posts
									</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-gray-900 dark:text-white">
										{profile.user?.totalFollowers}
									</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										Followers
									</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-gray-900 dark:text-white">
										{profile.user?.totalFollowing}
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
					{profile.posts.map((post) => (
						<Post key={post.id} post={post} />
					))}
				</div>
			</div>
		</div>
	);
}
