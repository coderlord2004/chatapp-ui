import { useRequest } from "@/hooks/useRequest";
import { useState } from "react";
import { reactionTypes, IconReactionType } from "@/const/ReactionTypes";
import { ReactionType } from "@/types/Reaction";
import { PostType } from "@/types/Post";
import { getReactionType } from "@/const/ReactionTypes";

type Props = {
    postData: PostType;
    onReaction: (reactionType: string) => void;
};

export default function Reaction({ postData, onReaction }: Props) {
    const { post } = useRequest();
    const [reaction, setReaction] = useState<ReactionType>(postData.reacted || 'LIKE');
    const [showReactionMenu, setShowReactionMenu] = useState(false);

    const handleReactionPost = async (targetId: number, reactionType: string) => {
        await post("reaction/post/save/", {
            targetId: targetId,
            targetType: "POST",
            reactionType: reactionType,
        });
    };

    const handleClickReaction = async (reactionType: ReactionType) => {
        setReaction(reactionType);
        setShowReactionMenu(false);
        onReaction(reactionType)
        await handleReactionPost(postData.id, reactionType);
    };

    return (
        <div
            className="group relative mx-1 flex flex-1 items-center justify-center rounded-lg py-2 text-gray-600"
            onMouseEnter={() => setShowReactionMenu(true)}
            onMouseLeave={() => setShowReactionMenu(false)}
        >
            {showReactionMenu && (
                <div className="absolute top-[-100%] left-0 flex gap-2 rounded-[30px] bg-gray-800 p-2 transition-all duration-300">
                    {reactionTypes.map((reactionType, index) => (
                        <button
                            key={index}
                            className="text-lg hover:scale-125 transition-all duration-200 cursor-pointer animate-fadeInUp"
                            style={{ animationDelay: `${index * 50}ms` }}
                            onClick={() => handleClickReaction(reactionType.type)}
                        >
                            {reactionType.icon}
                        </button>
                    ))}
                </div>
            )}

            <div
                className="w-full h-full cursor-pointer flex items-center justify-center"
                onClick={() => handleClickReaction(reaction)}
                style={{
                    backgroundColor: postData.reacted ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    color: postData.reacted ? '#3b82f6' : 'inherit',
                }}
            >
                {getReactionType(reaction).icon}
                {reaction.charAt(0).toUpperCase() +
                    reaction.toLowerCase().slice(1)}
            </div>
        </div>
    );
}
