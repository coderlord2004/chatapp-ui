import { useEffect, useState } from "react"
import { useRequest } from "@/hooks/useRequest"
import { UserWithAvatar } from "@/types/User";
import Avatar from "./Avatar";

type Props = {
}

export default function FriendSuggesstion({ }: Props) {
    const { get } = useRequest();
    const [friendSuggestions, setFriendSuggestions] = useState<UserWithAvatar[]>([]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            const data = await get('users/friend-suggestions/', { params: { page: 1 } });
            setFriendSuggestions(data);
        }
        fetchSuggestions();
    }, [])

    return (
        <div>
            <h1>Gợi ý kết bạn</h1>

            <div className="mt-4 flex flex-col gap-2">
                {friendSuggestions.map((user) => (
                    <div key={user.id} className="flex items-center space-x-4 mb-4">
                        <Avatar
                            author={user.username}
                            src={user.avatar}
                            className="h-10 w-10"
                        />
                        <p className="text-sm text-gray-500">{user.username}</p>
                        <button className="ml-auto px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                            Thêm bạn bè
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}