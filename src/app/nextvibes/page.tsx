'use client';

import React, { useEffect, useState } from 'react';
import { PostType } from '@/types/Post';
import { useRequest } from '@/hooks/useRequest';
import { motion } from 'framer-motion';
import { FaRegThumbsUp, FaRegCommentDots, FaShare } from 'react-icons/fa';
import Header from '@/components/Header';
import Post from '@/components/Post';

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
					<Post post={post} />
				))}
			</div>
		</div>
	);
}
