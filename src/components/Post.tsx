import React, { useState } from 'react';
import { PostType } from '@/types/Post';
import Avatar from './Avatar';
import { useRequest } from '@/hooks/useRequest';

type Props = {
	post: PostType;
};

export default function Post({ post }: Props) {
	// const { get, post } = useRequest();
	const [isLiked, setIsLiked] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [showComments, setShowComments] = useState(false);

	const handleLike = () => {
		setIsLiked(!isLiked);
	};

	const handleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	const handleCommentToggle = () => {
		setShowComments(!showComments);
	};

	const captionBackgrounds = [
		'bg-gradient-to-br from-purple-500 to-pink-600',
		'bg-gradient-to-br from-pink-400 to-red-500',
		'bg-gradient-to-br from-blue-400 to-cyan-400',
		'bg-gradient-to-br from-green-400 to-teal-400',
		'bg-gradient-to-br from-yellow-400 to-orange-400',
	];
	const getCaptionBackground = (bgType: number) => {
		return captionBackgrounds[bgType - 1] || captionBackgrounds[0];
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInHours = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60 * 60),
		);

		if (diffInHours < 1) {
			return 'Vừa xong';
		} else if (diffInHours < 24) {
			return `${diffInHours} giờ trước`;
		} else {
			return date.toLocaleDateString('vi-VN');
		}
	};

	const getVisibilityIcon = (visibility: string) => {
		switch (visibility) {
			case 'PUBLIC':
				return '🌐';
			case 'FRIEND':
				return '👥';
			case 'PRIVATE':
				return '🔒';
			default:
				return '🌐';
		}
	};

	return (
		<div className="mb-4 overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
			{/* Header bài đăng */}
			<div className="flex items-center justify-between p-4">
				<div className="flex items-center">
					<div className="flex w-full items-center gap-[10px]">
						<Avatar src={post.author.avatar} className="h-[50px] w-[50px]" />
						<div>
							<p>{post.author.username}</p>
							<div className="mt-0.5 flex items-center text-sm text-gray-500">
								<span>{formatDate(post.createdOn)}</span>
								<span className="ml-2">
									{getVisibilityIcon(post.visibility)}
								</span>
							</div>
						</div>
					</div>
				</div>
				<button className="flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-100">
					<span className="text-xl">⋮</span>
				</button>
			</div>

			{/* Nội dung bài đăng */}
			<div className="px-4">
				{post.caption && (
					<div
						className={`relative mb-3 rounded-xl p-3 text-white transition-all duration-300 ${getCaptionBackground(post.captionBackground)} ${isExpanded ? '' : 'max-h-24 overflow-hidden'}`}
					>
						<p
							className={`leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}
						>
							{post.caption}
						</p>
						{post.caption.length > 150 && (
							<button
								onClick={handleExpand}
								className="mt-2 rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white transition-colors duration-200 hover:bg-white/30"
							>
								{isExpanded ? 'Thu gọn' : 'Xem thêm'}
							</button>
						)}
					</div>
				)}

				{post.postAttachmentType === 'MEDIA' ? (
					<div
						className={`mb-3 grid gap-1 ${post.attachments.length === 1 ? 'grid-cols-1' : post.attachments.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}
					>
						{post.attachments.map((attachment, index) => (
							<div key={index} className="relative overflow-hidden rounded-lg">
								{attachment.type === 'IMAGE' ? (
									<img
										src={attachment.source}
										alt={`Media ${index + 1}`}
										className="h-auto w-full object-cover"
									/>
								) : (
									<video controls className="h-auto w-full">
										<source src={attachment.source} type="video/mp4" />
										Trình duyệt của bạn không hỗ trợ video.
									</video>
								)}
							</div>
						))}
					</div>
				) : (
					post.sharedPost && (
						<div className="mb-3 overflow-hidden rounded-lg border border-gray-200">
							<Post post={post.sharedPost} />
						</div>
					)
				)}
			</div>

			{/* Thống kê bài đăng */}
			<div className="flex items-center justify-between border-t border-b border-gray-100 px-4 py-2 text-sm text-gray-500">
				<div className="flex items-center">
					{post.topReactionTypes && post.topReactionTypes.length > 0 && (
						<div className="mr-2 flex items-center">
							{post.topReactionTypes.map((reaction, index) => (
								<span key={index} className="-ml-1 text-base first:ml-0">
									{reaction}
								</span>
							))}
						</div>
					)}
					{post.totalReactions > 0 && <span>{post.totalReactions}</span>}
				</div>
				<div className="flex space-x-3">
					{post.totalComments > 0 && (
						<span className="cursor-pointer hover:underline">
							{post.totalComments} bình luận
						</span>
					)}
					{post.totalShares > 0 && (
						<span className="cursor-pointer hover:underline">
							{post.totalShares} chia sẻ
						</span>
					)}
				</div>
			</div>

			{/* Thanh hành động */}
			<div className="flex justify-around px-2 py-1">
				<button
					className={`mx-1 flex flex-1 items-center justify-center rounded-lg py-2 transition-all duration-200 ${
						isLiked
							? 'text-blue-600 hover:bg-blue-50'
							: 'text-gray-600 hover:bg-gray-100'
					}`}
					onClick={handleLike}
				>
					<span
						className={`mr-2 text-lg transition-transform duration-300 ${
							isLiked ? 'scale-110' : 'scale-100'
						}`}
					>
						👍
					</span>
					<span className="font-medium">Thích</span>
				</button>

				<button
					className="mx-1 flex flex-1 items-center justify-center rounded-lg py-2 text-gray-600 transition-colors duration-200 hover:bg-gray-100"
					onClick={handleCommentToggle}
				>
					<span className="mr-2 text-lg">💬</span>
					<span className="font-medium">Bình luận</span>
				</button>

				<button className="mx-1 flex flex-1 items-center justify-center rounded-lg py-2 text-gray-600 transition-colors duration-200 hover:bg-gray-100">
					<span className="mr-2 text-lg">↪️</span>
					<span className="font-medium">Chia sẻ</span>
				</button>
			</div>

			{/* Khu vực bình luận */}
			{showComments && (
				<div className="animate-fadeIn border-t border-gray-100 p-4">
					<div className="flex items-center">
						<input
							type="text"
							placeholder="Viết bình luận..."
							className="flex-1 rounded-full border-none bg-gray-100 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
						<button className="ml-2 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-blue-600">
							Gửi
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
