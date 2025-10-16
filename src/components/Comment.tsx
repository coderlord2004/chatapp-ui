import Avatar from './Avatar';
import { CommentType, CommentResponse } from '@/types/Comment';
import { useRequest } from '@/hooks/useRequest';
import { useRef, useState } from 'react';
import { FaReply } from 'react-icons/fa';
import { formatDate } from '@/utils/formatDateTime';
import { HiOutlineDotsCircleHorizontal } from 'react-icons/hi';
import Menu from './Menu';
import {
	MdDelete,
	MdOutlineReportGmailerrorred,
	MdBlockFlipped,
} from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/hooks/useNotification';

type Props = {
	data: CommentResponse;
	level: number;
};

export default function Comment({ data, level }: Props) {
	const { authUser } = useAuth();
	const { get, post, remove, patch } = useRequest();
	const [commentData, setCommentData] = useState<CommentType>(data.commentData);
	const [childComments, setChildComments] = useState<CommentResponse[]>([]);
	const [showReplyComment, setShowReplyComment] = useState(false);
	const commentReplyRef = useRef<HTMLTextAreaElement | null>(null);
	const commentEditRef = useRef<HTMLTextAreaElement | null>(null);
	const [isEditing, setIsEditing] = useState<boolean>(false);

	const { showNotification } = useNotification();

	const commentMenuData = [
		{
			accepted: authUser?.id !== data.commentData.user.id,
			icon: <MdOutlineReportGmailerrorred className="" />,
			title: 'Báo cáo bình luận',
			action: () => {},
		},
		{
			title: 'Chỉnh sửa bình luận',
			icon: <CiEdit className="text-green-500" />,
			action: () => {
				commentEditRef.current?.focus();
				setIsEditing(!isEditing);
			},
		},
		{
			title: 'Xóa bình luận',
			icon: <MdDelete className="text-red-500" />,
			action: () => handleDeleteComment(data.commentData.id),
		},
		{
			accepted: authUser?.id !== data.commentData.user.id,
			icon: <MdBlockFlipped className="text-red-600" />,
			title: 'Chặn người dùng',
			action: () => {},
		},
	];

	async function handleGetChildComments(rootCommentId: number) {
		const data = await get('comment/child/get/', {
			params: {
				commentId: rootCommentId,
				page: 1,
			},
		});
		setChildComments(data);
	}

	async function handleUpdateComment(commentId: number, content: string) {
		setCommentData({
			...commentData,
			content,
		});
		await patch('comment/update/', {
			commentId: commentId,
			content: content,
		});
		showNotification({
			type: 'success',
			message: 'Thành công!',
		});
	}

	async function handleDeleteComment(commentId: number) {
		await remove(`comment/delete/?commentId=${commentId}`);
	}

	async function handleReplyComment(parentCommentId: number) {
		if (!commentReplyRef.current) return;
		const content = commentReplyRef.current.value;
		if (content.trim() === '') return;
		await post('comment/reply/', {
			commentId: parentCommentId,
			content: content,
		});
		commentReplyRef.current.value = '';
	}

	return (
		<div className="flex flex-col gap-2">
			<div
				className="relative flex cursor-pointer flex-col gap-2 rounded-lg border border-gray-300 bg-white p-4 shadow-md transition-shadow hover:shadow-lg"
				style={{ marginLeft: `${Math.min(level * 20, 60)}px` }}
			>
				<div className="flex flex-col gap-2">
					<div className="flex items-start">
						<Avatar
							author={commentData.user.username}
							src={commentData.user.avatar}
							className="h-10 w-10 rounded-full"
						/>
						<div className="ml-4 flex flex-col gap-2">
							<strong>{commentData.user.username}</strong>
							<div className="mt-2 flex gap-2 text-gray-800">
								{isEditing ? (
									<div className="">
										<textarea
											ref={commentEditRef}
											id="edit-comment"
											className="w-full rounded-lg border border-gray-300 p-2 focus:border-purple-600 focus:outline-none"
											rows={2}
											defaultValue={commentData.content}
										></textarea>

										<button
											type="submit"
											className="cursor-pointer rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
											onClick={() => {
												if (commentEditRef.current) {
													const newContent = commentEditRef.current.value;
													handleUpdateComment(commentData.id, newContent);
													setIsEditing(false);
												}
											}}
										>
											Gửi
										</button>
									</div>
								) : (
									<p>{commentData.content}</p>
								)}
								<div className="text-gray-500">
									{formatDate(commentData.commentedAt)}
								</div>
							</div>
						</div>
					</div>

					<div
						className="flex cursor-pointer items-center justify-end gap-1 text-sm text-gray-500 select-none hover:text-purple-600 hover:underline"
						onClick={() => setShowReplyComment(!showReplyComment)}
					>
						<p className="">Trả lời</p>
						<FaReply />
					</div>

					{showReplyComment && (
						<form
							className="flex items-start justify-center gap-1"
							onSubmit={(e) => {
								e.preventDefault();
								handleReplyComment(commentData.id);
							}}
						>
							<textarea
								ref={commentReplyRef}
								id={'reply-' + commentData.id}
								className="w-full rounded-lg border border-gray-300 p-2 focus:border-purple-600 focus:outline-none"
								rows={2}
								placeholder="Viết phản hồi..."
							></textarea>
							<button
								type="submit"
								className="cursor-pointer rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
							>
								Gửi
							</button>
						</form>
					)}
				</div>

				{data.totalChildComments > 0 && childComments.length == 0 && (
					<div
						className="text-right text-sm text-gray-500 italic"
						onClick={() => handleGetChildComments(commentData.id)}
					>
						Xem thêm {data.totalChildComments} phản hồi
					</div>
				)}

				<Menu
					data={commentMenuData}
					position="left"
					className="absolute top-2 right-2 cursor-pointer text-2xl text-black hover:text-purple-600"
				>
					<div>
						<HiOutlineDotsCircleHorizontal />
					</div>
				</Menu>
			</div>

			{childComments.length > 0 &&
				childComments.map((childComment) => (
					<Comment
						key={childComment.commentData.id}
						level={level + 1}
						data={childComment}
					/>
				))}
		</div>
	);
}
