'use client';

import React, { useEffect, useState } from 'react';
import { PostType } from '@/types/Post';
import { useRequest } from '@/hooks/useRequest';
import Header from '@/components/Header';
import Post from '@/components/Post';
import FriendSuggesstion from '@/components/FriendSuggesstion';

type Props = {};

export default function Page({}: Props) {
	const [newsFeeds, setNewsFeeds] = useState<PostType[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { get } = useRequest();

	useEffect(() => {
		const getNewsFeed = async () => {
			try {
				setIsLoading(true);
				const data = await get('posts/newsfeed/', { params: { page: 1 } });
				setNewsFeeds(data);
			} catch (error) {
				console.error('Error fetching news feed:', error);
			} finally {
				setIsLoading(false);
			}
		};
		getNewsFeed();
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
			<Header
				className="fixed top-0 right-0 left-0 z-50 border-b border-gray-700 bg-gray-900/80 backdrop-blur-lg"
				onFocusInput={() => {}}
			/>

			<div className="min-h-screen pt-[70px]">
				<div className="max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
					<div className="flex flex-col gap-6 lg:flex-row">
						{/* Left Sidebar - Hidden on mobile */}
						<div className="hidden lg:block lg:w-1/4 xl:w-1/5">
							<div className="sticky top-[86px] space-y-4">
								{/* Navigation Menu */}
								<div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-4 backdrop-blur-lg">
									<nav className="space-y-2">
										{['Home', 'Friends', 'Groups', 'Events', 'Memories'].map(
											(item) => (
												<button
													key={item}
													className="flex w-full items-center space-x-3 rounded-xl p-3 text-gray-200 transition-all duration-200 hover:bg-gray-700/50 hover:text-white"
												>
													<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
														<span className="text-sm font-semibold">
															{item.charAt(0)}
														</span>
													</div>
													<span className="font-medium">{item}</span>
												</button>
											),
										)}
									</nav>
								</div>

								{/* User Stats */}
								<div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-4 backdrop-blur-lg">
									<h3 className="mb-3 font-semibold text-gray-300">
										Your Profile
									</h3>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between text-gray-400">
											<span>Posts</span>
											<span className="text-white">42</span>
										</div>
										<div className="flex justify-between text-gray-400">
											<span>Friends</span>
											<span className="text-white">128</span>
										</div>
										<div className="flex justify-between text-gray-400">
											<span>Visits</span>
											<span className="text-white">1.2k</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Main Feed */}
						<div className="flex flex-col items-center space-y-6 lg:w-2/4 xl:w-3/5">
							{/* Create Post Card */}
							<div className="w-full max-w-2xl rounded-2xl border border-gray-700 bg-gray-800/50 p-4 backdrop-blur-lg">
								<div className="flex items-center space-x-4">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-purple-500">
										<span className="font-semibold text-white">U</span>
									</div>
									<button className="flex-1 rounded-xl bg-gray-700/50 p-3 text-left text-gray-400 transition-colors hover:bg-gray-600/50 hover:text-gray-300">
										What's on your mind?
									</button>
								</div>
								<div className="mt-4 flex justify-between px-4">
									{['Live', 'Photo', 'Feeling'].map((item) => (
										<button
											key={item}
											className="flex items-center space-x-2 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-700/30 hover:text-gray-300"
										>
											<div className="h-6 w-6 rounded bg-current"></div>
											<span className="text-sm font-medium">{item}</span>
										</button>
									))}
								</div>
							</div>

							{/* Loading State */}
							{isLoading && (
								<div className="w-full max-w-2xl space-y-4">
									{[1, 2, 3].map((i) => (
										<div
											key={i}
											className="animate-pulse rounded-2xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-lg"
										>
											<div className="mb-4 flex items-center space-x-4">
												<div className="h-12 w-12 rounded-full bg-gray-700"></div>
												<div className="space-y-2">
													<div className="h-4 w-32 rounded bg-gray-700"></div>
													<div className="h-3 w-24 rounded bg-gray-700"></div>
												</div>
											</div>
											<div className="space-y-3">
												<div className="h-4 rounded bg-gray-700"></div>
												<div className="h-4 w-5/6 rounded bg-gray-700"></div>
											</div>
										</div>
									))}
								</div>
							)}

							{/* Posts */}
							{!isLoading &&
								newsFeeds.map((post) => (
									<div key={post.id} className="w-full max-w-2xl">
										<Post data={post} />
									</div>
								))}

							{/* Empty State */}
							{!isLoading && newsFeeds.length === 0 && (
								<div className="w-full max-w-2xl py-12 text-center">
									<div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-8 backdrop-blur-lg">
										<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-700">
											<span className="text-2xl">📝</span>
										</div>
										<h3 className="mb-2 text-xl font-semibold text-white">
											No posts yet
										</h3>
										<p className="text-gray-400">
											Be the first to share something with your friends!
										</p>
									</div>
								</div>
							)}
						</div>

						{/* Right Sidebar - Friend Suggestions */}
						<div className="hidden lg:block lg:w-1/4 xl:w-1/5">
							<div className="sticky top-[86px] space-y-6">
								<FriendSuggesstion />

								{/* Trending Topics */}
								<div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-4 backdrop-blur-lg">
									<h3 className="mb-4 font-semibold text-white">
										Trending Topics
									</h3>
									<div className="space-y-3">
										{['Technology', 'Sports', 'Music', 'Gaming'].map(
											(topic, index) => (
												<button
													key={topic}
													className="group flex w-full items-center justify-between rounded-lg p-2 transition-colors hover:bg-gray-700/30"
												>
													<span className="text-gray-300 group-hover:text-white">
														#{topic}
													</span>
													<span className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-500">
														{index + 1}k
													</span>
												</button>
											),
										)}
									</div>
								</div>

								{/* Footer Links */}
								<div className="space-y-2 text-xs text-gray-500">
									<div className="flex flex-wrap gap-2">
										{['Privacy', 'Terms', 'Advertising', 'Cookies'].map(
											(item) => (
												<button
													key={item}
													className="transition-colors hover:text-gray-400"
												>
													{item}
												</button>
											),
										)}
									</div>
									<p>© 2024 YourApp. All rights reserved.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Mobile Navigation Bottom Bar */}
			<div className="fixed right-0 bottom-0 left-0 border-t border-gray-700 bg-gray-900/95 backdrop-blur-lg lg:hidden">
				<div className="flex items-center justify-around p-3">
					{['Home', 'Search', 'Add', 'Notifications', 'Menu'].map((item) => (
						<button
							key={item}
							className="flex flex-col items-center rounded-xl p-2 transition-colors hover:bg-gray-700/50"
						>
							<div className="mb-1 h-6 w-6 rounded bg-gray-400"></div>
							<span className="text-xs text-gray-400">{item}</span>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
