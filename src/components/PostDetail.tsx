import { useEffect, useState } from "react"
import { useRequest } from "@/hooks/useRequest"
import { PostType } from '@/types/Post';
import { CommentType, CommentResponse } from "@/types/Comment";
import Avatar from "./Avatar";
import Post from "./Post";
import Comment from "./Comment";
import Skeleton from "./Loading/Skeleton";

type Props = {
    data: PostType;
    onClose: () => void;
}

export default function PostDetail({ data, onClose }: Props) {
    const { get } = useRequest();
    const [rootComments, setRootComments] = useState<CommentResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleGetComments = async () => {
            const results = await get('comment/get/', {
                params: {
                    targetId: data.id,
                    targetType: "POST",
                    page: 1
                }
            })
            setLoading(false);
            setRootComments(results);
        }
        handleGetComments();
    }, [])

    return (
        <div className="fixed inset-0 z-50 flex h-full w-full bg-black/70 p-4">
            <div className="scrollBarStyle m-auto w-[400px] h-[90%] overflow-y-auto rounded-[8px]">
                <Post data={data} />

                {loading ? (
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-slate-800 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
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
                        className="border-t border-gray-300 flex flex-col bg-white gap-2 p-2"
                        style={{
                            display: rootComments.length === 0 ? 'none' : 'block'
                        }}
                    >
                        <h1>Bình luận</h1>
                        <div
                            className="flex flex-col bg-white gap-2"
                        >

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
    )
}