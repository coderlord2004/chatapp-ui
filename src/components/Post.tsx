import React, { useRef, useState } from 'react';
import { PostType } from '@/types/Post';
import Avatar from './Avatar';
import { useRequest } from '@/hooks/useRequest';
import PostDetail from './PostDetail';
import PostInteraction from './PostInteraction';
import { formatDate } from '@/utils/formatDateTime';
import AudioCard from './AudioCard';
import Menu from './Menu';
import { useNotification } from '@/hooks/useNotification';
import { useAuth } from '@/contexts/AuthContext';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete, MdOutlineReport, MdBlock } from "react-icons/md";
import { VscInspect } from "react-icons/vsc";

type Props = {
	order?: number;
	data: PostType;
	onRemove?: (id: number) => void;
};

export default function Post({ order, data, onRemove }: Props) {
	const { authUser } = useAuth();
	const { get, post, remove } = useRequest();
	const { showNotification } = useNotification();
	const [isExpanded, setIsExpanded] = useState(false);
	const [showPostDetail, setShowPostDetail] = useState(false);

	const captionBackgrounds = [
		'none',
		'bg-gradient-to-br from-purple-500 to-pink-600',
		'bg-gradient-to-br from-pink-400 to-red-500',
		'bg-gradient-to-br from-blue-400 to-cyan-400',
		'bg-gradient-to-br from-green-400 to-teal-400',
		'bg-gradient-to-br from-yellow-400 to-orange-400',
	];
	const getCaptionBackground = (bgType: number) => {
		return captionBackgrounds[bgType] || captionBackgrounds[0];
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

	async function deletePost() {
		if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
			const res = await remove(`posts/delete/`, {
				params: { postId: data.id },
			});
			showNotification({
				type: 'success',
				message: res,
			});
			onRemove && onRemove(data.id);
		}
	}

	const postMenuItems = [
		{
			accepted: authUser?.username === data.author.username,
			title: 'Chỉnh sửa bài viết',
			icon: <FaRegEdit className='text-2xl bg-green-400' />,
			action: () => { }
		},
		{
			accepted: authUser?.username === data.author.username,
			title: 'Xóa bài viết',
			icon: <MdDelete className='text-2xl bg-red-400' />,
			action: () => deletePost()
		},
		{
			accepted: true,
			title: 'Xác thực nội dung bài viết',
			icon: <VscInspect className='text-2xl bg-blue-400' />,
			action: () => { }
		},
		{
			accepted: true,
			title: 'Báo cáo bài viết',
			icon: <MdOutlineReport className='text-2xl bg-yellow-400' />,
			action: () => { }
		},
		{
			accepted: true,
			title: 'Chặn người dùng',
			icon: <MdBlock className='text-2xl bg-red-400' />,
			action: () => { }
		}
	];

	return (
		<div
			className={`w-full min-h-[300px] mb-4 rounded-xl bg-white text-black shadow-sm transition-all duration-300 hover:shadow-lg`}
			style={{ animationDelay: `${(order ?? 0) * 0.1}s` }}
		>
			<div className="flex items-center justify-between p-4">
				<div className="flex items-center">
					<div className="flex w-full items-center gap-[10px]">
						<Avatar
							author={data.author.username}
							src={data.author.avatar}
							className="h-[50px] w-[50px]"
						/>
						<div>
							<p>{data.author.username}</p>
							<div className="mt-0.5 flex items-center text-sm text-gray-500">
								<span>{formatDate(data.publishedAt)}</span>
								<span className="ml-2">
									{getVisibilityIcon(data.visibility)}
								</span>
							</div>
						</div>
					</div>
				</div>
				<Menu
					data={postMenuItems}
				>
					<button className="flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-100">
						<span className="text-xl">⋮</span>
					</button>
				</Menu>
			</div>

			<div className="px-4">
				{data.caption && (
					<div
						className={`relative mb-3 rounded-xl p-3 text-black transition-all duration-300 ${getCaptionBackground(data.captionBackground)} ${isExpanded ? '' : 'max-h-24 overflow-hidden'}`}
					>
						<p
							className={`leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}
						>
							{data.caption}
						</p>
						{data.caption.length > 150 && (
							<button
								onClick={() => setIsExpanded(!isExpanded)}
								className="mt-2 rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white transition-colors duration-200 hover:bg-white/30"
							>
								{isExpanded ? 'Thu gọn' : 'Xem thêm'}
							</button>
						)}
					</div>
				)}

				{data.postAttachmentType === 'MEDIA' ? (
					<div
						className={`mb-3 grid gap-1 ${data.attachments.length === 1 ? 'grid-cols-1' : data.attachments.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}
					>
						{data.attachments.map((attachment, index) => (
							<div key={index} className="relative overflow-hidden rounded-lg">
								{attachment.type === 'IMAGE' ? (
									<img
										src={attachment.source}
										alt={`Media ${index + 1}`}
										className="h-auto w-full object-cover"
									/>
								) : attachment.type === 'VIDEO' ? (
									<video controls className="h-auto w-full">
										<source src={attachment.source} type="video/mp4" />
										Trình duyệt của bạn không hỗ trợ video.
									</video>
								) : attachment.type === 'AUDIO' ? (
									<AudioCard
										name={attachment.name}
										src={attachment.source}
										description={attachment.description}
									/>
								) : (
									<div></div>
								)}
							</div>
						))}
					</div>
				) : (
					data.sharedPost && (
						<div className="mb-3 overflow-hidden rounded-lg border border-gray-200">
							<Post data={data.sharedPost} />
						</div>
					)
				)}
			</div>

			<PostInteraction
				data={data}
				onShowPostDetail={() => setShowPostDetail(true)}
			/>

			{showPostDetail && (
				<PostDetail data={data} onClose={() => setShowPostDetail(false)} />
			)}
		</div>
	);
}
