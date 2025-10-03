'use client';

import React, { useEffect, useState } from 'react';
import { PostType } from '@/types/Post';
import { useRequest } from '@/hooks/useRequest';
import { motion } from 'framer-motion';
import { FaRegThumbsUp, FaRegCommentDots, FaShare } from 'react-icons/fa';
import Header from '@/components/Header';
import Post from '@/components/Post';
import FriendSuggesstion from '@/components/FriendSuggesstion';

type Props = {};

export default function Page({ }: Props) {
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
		<div className="relative flex h-screen justify-center bg-gray-900 text-gray-100 overflow-y-auto">
			<Header
				className="w-full h-[70px]"
				onFocusInput={() => { }}
			/>
			<div className='flex w-full h-full mt-[70px]'>
				<div className='fixed top-[70px] left-0 w-[20%] h-full p-4 bg-red-800 text-gray-100 hidden sm:block'>

				</div>
				<div className="w-[60%] mx-auto flex flex-col items-center justify-start">
					{newsFeeds.map((post, index) => (
						<Post
							key={post.id}
							data={post}
						/>
					))}
				</div>
				<div
					className='fixed top-[70px] right-0 w-[20%] h-full p-4 bg-gray-800 text-gray-100 hidden sm:block'
				>
					<FriendSuggesstion />
				</div>
			</div>
		</div>
	);
}
