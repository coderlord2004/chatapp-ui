import Avatar from "./Avatar"
import { CommentType, CommentResponse } from "@/types/Comment";
import { useRequest } from "@/hooks/useRequest";
import { useRef, useState } from "react";
import { FaReply } from "react-icons/fa";
import { formatDate } from "@/utils/formatDateTime";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import Menu from "./Menu";

type Props = {
    data: CommentResponse;
    level: number;
}

export default function Comment({ data, level }: Props) {
    const { get, post, remove, patch } = useRequest();
    const [childComments, setChildComments] = useState<CommentResponse[]>([]);
    const [showReplyComment, setShowReplyComment] = useState(false);
    const commentReplyRef = useRef<HTMLTextAreaElement | null>(null);
    const commentEditRef = useRef<HTMLTextAreaElement | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const commentMenuData = [
        {
            title: 'Báo cáo bình luận',
            action: () => { }
        },
        {
            title: 'Chỉnh sửa bình luận',
            action: () => {
                commentEditRef.current?.focus();
                setIsEditing(!isEditing)
            }
        },
        {
            title: 'Xóa bình luận',
            action: () => handleDeleteComment(data.commentData.id)
        },
        {
            title: 'Chặn người dùng',
            action: () => { }
        }
    ]

    async function handleGetChildComments(rootCommentId: number) {
        const data = await get('comment/child/get/', {
            params: {
                commentId: rootCommentId,
                page: 1
            }
        })
        setChildComments(data);
    }

    async function handleUpdateComment(commentId: number, content: string) {
        await patch('comment/update/', {
            commentId: commentId,
            content: content
        })
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
            content: content
        })
        commentReplyRef.current.value = '';
    }

    return (
        <div className="flex flex-col gap-2">
            <div
                className='rounded-lg border border-gray-300 bg-white p-4 shadow-md flex flex-col gap-2 hover:shadow-lg transition-shadow cursor-pointer relative'
                style={{ marginLeft: `${Math.min(level * 20, 60)}px` }}
            >
                <div className="flex flex-col gap-2">
                    <div className="flex items-start">
                        <Avatar
                            author={data.commentData.user.username}
                            src={data.commentData.user.avatar}
                            className="h-10 w-10 rounded-full"
                        />
                        <div className="ml-4 flex flex-col gap-2">
                            <strong>{data.commentData.user.username}</strong>
                            <div className="mt-2 text-gray-800 flex gap-2">
                                {isEditing ? (
                                    <div className="">
                                        <textarea
                                            ref={commentEditRef}
                                            id="edit-comment"
                                            className="w-full rounded-lg border border-gray-300 p-2 focus:border-purple-600 focus:outline-none"
                                            rows={2}
                                            defaultValue={data.commentData.content}
                                        ></textarea>

                                        <button
                                            type="submit" className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 cursor-pointer"
                                            onClick={() => {
                                                if (commentEditRef.current) {
                                                    const newContent = commentEditRef.current.value;
                                                    handleUpdateComment(data.commentData.id, newContent);
                                                    setIsEditing(false);
                                                }
                                            }}
                                        >
                                            Gửi
                                        </button>
                                    </div>
                                ) : (
                                    <p>{data.commentData.content}</p>
                                )}
                                <div className="text-gray-500">{formatDate(data.commentData.commentedAt)}</div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="text-sm text-gray-500 hover:text-purple-600 hover:underline cursor-pointer flex items-center justify-end gap-1 select-none"
                        onClick={() => setShowReplyComment(!showReplyComment)}
                    >
                        <p className="">Trả lời</p>
                        <FaReply />
                    </div>

                    {showReplyComment && (
                        <form
                            className="flex gap-1 items-start justify-center "
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleReplyComment(data.commentData.id);
                            }}
                        >
                            <textarea
                                ref={commentReplyRef}
                                id={"reply-" + data.commentData.id}
                                className="w-full rounded-lg border border-gray-300 p-2 focus:border-purple-600 focus:outline-none"
                                rows={2}
                                placeholder="Viết phản hồi..."
                            ></textarea>
                            <button type="submit" className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 cursor-pointer">
                                Gửi
                            </button>
                        </form>
                    )}
                </div>

                {data.totalChildComments > 0 && childComments.length == 0 && (
                    <div className="text-sm text-gray-500 text-right italic" onClick={() => handleGetChildComments(data.commentData.id)}>
                        Xem thêm {data.totalChildComments} phản hồi
                    </div>
                )}

                <Menu
                    data={commentMenuData}
                    position="left"
                    className="absolute top-2 right-2 text-2xl text-black hover:text-purple-600 cursor-pointer"
                >
                    <div
                    >
                        <HiOutlineDotsCircleHorizontal />
                    </div>
                </Menu>
            </div>

            {
                childComments.length > 0 && (
                    childComments.map((childComment) => (
                        <Comment
                            key={childComment.commentData.id}
                            level={level + 1}
                            data={childComment}
                        />
                    ))
                )
            }
        </div >

    )
}