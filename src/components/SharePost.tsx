import { PostType } from "@/types/Post"
import Post from "./Post"

type Props = {
    sharedPost: PostType
}

export default function SharePost({ sharedPost }: Props) {
    return (
        <div>
            <input
                type="text"
                placeholder="Nói gì đó về bài viết này..."
            />
            <Post data={sharedPost} />
        </div>
    )
}