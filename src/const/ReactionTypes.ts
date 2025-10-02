import { ReactionType } from "@/types/Reaction";

type IconReactionType = {
    type: ReactionType;
    icon: string;
};

const reactionTypes: IconReactionType[] = [
    { type: "LIKE", icon: "👍" },
    { type: "LOVE", icon: "❤️" },
    { type: "HAHA", icon: "😂" },
    { type: "WOW", icon: "😮" },
    { type: "SAD", icon: "😢" },
    { type: "ANGRY", icon: "😡" },
];

const reactionTypesMap: { [key: string]: IconReactionType } = reactionTypes.reduce((map, reaction) => {
    map[reaction.type] = reaction;
    return map;
}, {} as { [key: string]: IconReactionType });

export function getReactionType(type: string): IconReactionType {
    return reactionTypesMap[type] || { type: "LIKE", icon: "👍" };
}

export { reactionTypes };
export type { IconReactionType };