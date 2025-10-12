'use client';

import React, { useEffect, useState } from 'react';
import { PostType } from '@/types/Post';
import { useRequest } from '@/hooks/useRequest';
import Header from '@/components/Header';
import Post from '@/components/Post';
import FriendSuggesstion from '@/components/FriendSuggesstion';

type Props = {};

export default function Page({ }: Props) {
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
				className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700"
				onFocusInput={() => { }}
			/>

			<div className="pt-[70px] min-h-screen">
				<div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex flex-col lg:flex-row gap-6">

						{/* Left Sidebar - Hidden on mobile */}
						<div className="lg:w-1/4 xl:w-1/5 hidden lg:block">
							<div className="sticky top-[86px] space-y-4">
								{/* Navigation Menu */}
								<div className="bg-gray-800/50 rounded-2xl p-4 backdrop-blur-lg border border-gray-700">
									<nav className="space-y-2">
										{['Home', 'Friends', 'Groups', 'Events', 'Memories'].map((item) => (
											<button
												key={item}
												className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-700/50 transition-all duration-200 text-gray-200 hover:text-white"
											>
												<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
													<span className="text-sm font-semibold">{item.charAt(0)}</span>
												</div>
												<span className="font-medium">{item}</span>
											</button>
										))}
									</nav>
								</div>

								{/* User Stats */}
								<div className="bg-gray-800/50 rounded-2xl p-4 backdrop-blur-lg border border-gray-700">
									<h3 className="font-semibold text-gray-300 mb-3">Your Profile</h3>
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
						<div className="lg:w-2/4 xl:w-3/5 flex flex-col items-center space-y-6">
							{/* Create Post Card */}
							<div className="w-full max-w-2xl bg-gray-800/50 rounded-2xl p-4 backdrop-blur-lg border border-gray-700">
								<div className="flex items-center space-x-4">
									<div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
										<span className="text-white font-semibold">U</span>
									</div>
									<button className="flex-1 text-left p-3 bg-gray-700/50 rounded-xl hover:bg-gray-600/50 transition-colors text-gray-400 hover:text-gray-300">
										What's on your mind?
									</button>
								</div>
								<div className="flex justify-between mt-4 px-4">
									{['Live', 'Photo', 'Feeling'].map((item) => (
										<button key={item} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700/30 transition-colors text-gray-400 hover:text-gray-300">
											<div className="w-6 h-6 bg-current rounded"></div>
											<span className="text-sm font-medium">{item}</span>
										</button>
									))}
								</div>
							</div>

							{/* Loading State */}
							{isLoading && (
								<div className="w-full max-w-2xl space-y-4">
									{[1, 2, 3].map((i) => (
										<div key={i} className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-lg border border-gray-700 animate-pulse">
											<div className="flex items-center space-x-4 mb-4">
												<div className="w-12 h-12 bg-gray-700 rounded-full"></div>
												<div className="space-y-2">
													<div className="h-4 bg-gray-700 rounded w-32"></div>
													<div className="h-3 bg-gray-700 rounded w-24"></div>
												</div>
											</div>
											<div className="space-y-3">
												<div className="h-4 bg-gray-700 rounded"></div>
												<div className="h-4 bg-gray-700 rounded w-5/6"></div>
											</div>
										</div>
									))}
								</div>
							)}

							{/* Posts */}
							{!isLoading && newsFeeds.map((post) => (
								<div key={post.id} className="w-full max-w-2xl">
									<Post data={post} />
								</div>
							))}

							{/* Empty State */}
							{!isLoading && newsFeeds.length === 0 && (
								<div className="w-full max-w-2xl text-center py-12">
									<div className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-lg border border-gray-700">
										<div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
											<span className="text-2xl">📝</span>
										</div>
										<h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
										<p className="text-gray-400">Be the first to share something with your friends!</p>
									</div>
								</div>
							)}
						</div>

						{/* Right Sidebar - Friend Suggestions */}
						<div className="lg:w-1/4 xl:w-1/5 hidden lg:block">
							<div className="sticky top-[86px] space-y-6">
								<FriendSuggesstion />

								{/* Trending Topics */}
								<div className="bg-gray-800/50 rounded-2xl p-4 backdrop-blur-lg border border-gray-700">
									<h3 className="font-semibold text-white mb-4">Trending Topics</h3>
									<div className="space-y-3">
										{['Technology', 'Sports', 'Music', 'Gaming'].map((topic, index) => (
											<button
												key={topic}
												className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-700/30 transition-colors group"
											>
												<span className="text-gray-300 group-hover:text-white">#{topic}</span>
												<span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
													{index + 1}k
												</span>
											</button>
										))}
									</div>
								</div>

								{/* Footer Links */}
								<div className="text-xs text-gray-500 space-y-2">
									<div className="flex flex-wrap gap-2">
										{['Privacy', 'Terms', 'Advertising', 'Cookies'].map((item) => (
											<button key={item} className="hover:text-gray-400 transition-colors">
												{item}
											</button>
										))}
									</div>
									<p>© 2024 YourApp. All rights reserved.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Mobile Navigation Bottom Bar */}
			<div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-700">
				<div className="flex justify-around items-center p-3">
					{['Home', 'Search', 'Add', 'Notifications', 'Menu'].map((item) => (
						<button
							key={item}
							className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-700/50 transition-colors"
						>
							<div className="w-6 h-6 bg-gray-400 rounded mb-1"></div>
							<span className="text-xs text-gray-400">{item}</span>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}