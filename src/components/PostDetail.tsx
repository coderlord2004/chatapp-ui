import { useEffect, useState } from 'react';
import { useRequest } from '@/hooks/useRequest';
import { PostType } from '@/types/Post';
import { CommentType, CommentResponse } from '@/types/Comment';
import Avatar from './Avatar';
import Post from './Post';
import Comment from './Comment';
import Skeleton from './Loading/Skeleton';

type Props = {
	data: PostType;
	onClose: () => void;
};

export default function PostDetail({ data, onClose }: Props) {
	const { get, post } = useRequest();
	const [rootComments, setRootComments] = useState<CommentResponse[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const handleGetComments = async () => {
			const results = await get('comment/get/', {
				params: {
					targetId: data.id,
					targetType: 'POST',
					page: 1,
				},
			});
			setLoading(false);
			setRootComments(results);
		};
		handleGetComments();
	}, []);

	useEffect(() => {
		async function increaseView() {
			await post(`posts/view/increase/?postId=${data.id}`);
		}
		const id = setTimeout(() => {
			increaseView();
		}, 60000);

		return () => {
			clearTimeout(id);
		};
	}, []);

	return (
		<div className="fixed inset-0 z-50 flex h-full w-full bg-black/70 p-4">
			<div className="scrollBarStyle m-auto h-[90%] w-[400px] overflow-y-auto rounded-[8px]">
				<Post data={data} />

				{loading ? (
					<div className="rounded-2xl border-b border-gray-200 bg-slate-800 p-4 dark:border-gray-700">
						<div className="mb-3 flex items-center gap-3">
							<Skeleton circle width={40} height={40} />
							<div className="flex flex-col gap-2">
								<Skeleton width={120} height={14} className="mb-1" />
								<Skeleton width={80} height={12} />
							</div>
						</div>

						<Skeleton count={2} className="mb-2" />
					</div>
				) : (
					<div
						className="flex flex-col gap-2 border-t border-gray-300 bg-white p-2"
						style={{
							display: rootComments.length === 0 ? 'none' : 'block',
						}}
					>
						<h1>Bình luận</h1>
						<div className="flex flex-col gap-2 bg-white">
							{rootComments.map((rootComment) => (
								<Comment
									key={rootComment.commentData.id}
									level={0}
									data={rootComment}
								/>
							))}
						</div>
					</div>
				)}
			</div>

			<div className="overlay" onClick={onClose}></div>
		</div>
	);
}
