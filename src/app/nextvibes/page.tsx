'use client';

import React, { useEffect, useState } from 'react';
import { PostType } from '@/types/Post';
import { useRequest } from '@/hooks/useRequest';
import { motion } from 'framer-motion';
import { FaRegThumbsUp, FaRegCommentDots, FaShare } from 'react-icons/fa';
import Header from '@/components/Header';

type Props = {};

export default function Page({}: Props) {
	const [newsFeeds, setNewsFeeds] = useState<PostType[]>([]);
	const { get } = useRequest();

	useEffect(() => {
		const getNewsFeed = async () => {
			const data = await get('posts/newsfeed/', { params: { page: 1 } });
			setNewsFeeds(data);
		};
		getNewsFeed();
	}, []);

	return (
		<div className="relative flex h-screen justify-center bg-gray-900 text-gray-100">
			<Header className="h-[70px]" />
			<div className="w-full max-w-2xl space-y-6 overflow-y-auto p-4">
				{newsFeeds.map((post, index) => (
					<motion.div
						key={post.id}
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1, duration: 0.5 }}
						className="overflow-hidden rounded-2xl bg-gray-800 shadow-lg"
					>
						{/* Header */}
						<div className="flex items-center gap-3 p-4">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-bold text-white">
								{post.id}
							</div>
							<div>
								<p className="font-semibold">User {post.id}</p>
								<p className="text-xs text-gray-400">
									{new Date(post.createdOn).toLocaleString()}
								</p>
							</div>
						</div>

						{/* Caption */}
						{post.caption && (
							<div
								className={`px-4 pb-2 text-sm leading-relaxed ${
									post.captionBackground === 1
										? 'mx-4 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 p-3 text-white'
										: ''
								}`}
							>
								{post.caption}
							</div>
						)}

						{/* Attachments */}
						{post.attachments && (
							<div className="px-4 py-2">
								{post.attachments.type === 'IMAGE' && (
									<img
										src={post.attachments.source}
										alt={post.attachments.name}
										className="max-h-96 w-full rounded-xl object-cover transition-transform hover:scale-[1.02]"
									/>
								)}
								{post.attachments.type === 'VIDEO' && (
									<video
										controls
										src={post.attachments.source}
										className="w-full rounded-xl"
									/>
								)}
							</div>
						)}

						{/* Actions */}
						<div className="flex items-center justify-between border-t border-gray-700 px-4 py-3 text-sm">
							<button className="flex items-center gap-2 transition hover:text-blue-400">
								<FaRegThumbsUp /> {post.totalReactions}
							</button>
							<button className="flex items-center gap-2 transition hover:text-green-400">
								<FaRegCommentDots /> {post.totalComments}
							</button>
							<button className="flex items-center gap-2 transition hover:text-pink-400">
								<FaShare /> {post.totalShares}
							</button>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
}
