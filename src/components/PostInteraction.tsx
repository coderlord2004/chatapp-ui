
import Reaction from './Reaction';
import { useState, useRef } from 'react';
import { PostType } from '@/types/Post';
import { useRequest } from '@/hooks/useRequest';
import { getReactionType } from '@/const/ReactionTypes';

type Props = {
    data: PostType;
    onShowPostDetail: () => void;
}

export default function PostInteraction({ data, onShowPostDetail }: Props) {
    const { post } = useRequest();
    const [numberInteraction, setNumberInteraction] = useState({
        reactionData: {
            totalReactions: data.totalReactions,
            topReactionTypes: data.topReactionTypes
        },
        totalComments: data.totalComments,
        totalShares: data.totalShares,
    });
    const [showComments, setShowComments] = useState(false);
    const commentTextRef = useRef<HTMLInputElement | null>(null);

    const handleCommentPost = async (targetId: number) => {
        if (!commentTextRef.current) return;
        const content = commentTextRef.current.value;
        if (content.trim() === '') return;

        await post('comment/create/', {
            targetId: targetId,
            targetType: "POST",
            content: content
        })
        commentTextRef.current.value = '';
        setNumberInteraction(prev => ({
            ...prev,
            totalComments: prev.totalComments + 1
        }))
    }
    const handleSharePost = async () => {

    }

    return (
        <div>
            <div
                className="min-h-[40px] flex items-center justify-between border-t border-b border-gray-200 px-4 py-2 text-sm cursor-pointer"
                onClick={onShowPostDetail}
            >
                {numberInteraction.reactionData.totalReactions > 0 && (
                    <div className="flex items-center">
                        <span>{numberInteraction.reactionData.totalReactions}</span>

                        <div className="mr-2 flex items-center">
                            {numberInteraction.reactionData.topReactionTypes.map((reaction, index) => (
                                <span key={index} className="-ml-1 text-base first:ml-0">
                                    {getReactionType(reaction).icon}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex space-x-3">
                    {numberInteraction.totalComments > 0 && (
                        <span className="cursor-pointer hover:underline">
                            {numberInteraction.totalComments} bình luận
                        </span>
                    )}
                    {numberInteraction.totalShares > 0 && (
                        <span className="cursor-pointer hover:underline">
                            {numberInteraction.totalShares} chia sẻ
                        </span>
                    )}
                </div>
            </div>

            <div className="flex justify-around px-2 py-1">
                <Reaction
                    postData={data}
                    onReaction={(reactionType: string) => setNumberInteraction(prev => ({
                        ...prev,
                        reactionData: {
                            totalReactions: prev.reactionData.totalReactions + 1,
                            topReactionTypes: prev.reactionData.topReactionTypes.includes(reactionType)
                                ? prev.reactionData.topReactionTypes
                                : [...prev.reactionData.topReactionTypes, reactionType
                                ].slice(0, 3)
                        }
                    }))}
                />

                <button
                    className="mx-1 flex flex-1 items-center justify-center rounded-lg py-2 text-gray-600 transition-colors duration-200 hover:bg-gray-100"
                    onClick={() => setShowComments(!showComments)}
                >
                    <span className="mr-2 text-lg">💬</span>
                    <span className="font-medium">Bình luận</span>
                </button>

                <button className="mx-1 flex flex-1 items-center justify-center rounded-lg py-2 text-gray-600 transition-colors duration-200 hover:bg-gray-100">
                    <span className="mr-2 text-lg">↪️</span>
                    <span className="font-medium">Chia sẻ</span>
                </button>
            </div>

            {showComments && (
                <div className="animate-fadeIn border-t border-gray-100 p-4">
                    <form
                        className="flex items-center"
                        onSubmit={e => {
                            e.preventDefault();
                            handleCommentPost(data.id);
                        }}
                    >
                        <input
                            ref={commentTextRef}
                            type="text"
                            placeholder="Viết bình luận..."
                            className="flex-1 rounded-full border-none bg-gray-100 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="ml-2 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-blue-600"
                        >
                            Gửi
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}