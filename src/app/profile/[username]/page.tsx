'use client'

import { useEffect, useState, use } from "react"
import { useRequest } from "@/hooks/useRequest"
import { UserInfo } from "@/types/User"
import { FiCamera, FiEdit, FiLink, FiMapPin, FiCalendar } from "react-icons/fi"
import Skeleton from "@/components/Loading/Skeleton"

export default function Page({
    params,
}: {
    params: Promise<{ username: string }>
}) {
    const { username } = use(params)
    const { get } = useRequest()
    const [user, setUser] = useState<UserInfo | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getUser = async () => {
            try {
                setIsLoading(true)
                const data = await get('users/info/', {
                    params: {
                        username: username
                    }
                })
                setUser(data)
            } catch (error) {
                console.error("Failed to fetch user data:", error)
            } finally {
                setIsLoading(false)
            }
        }
        getUser()
    }, [username])

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Cover Photo */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
                {isLoading ? (
                    <Skeleton height="100%" className="rounded-none" />
                ) : user?.coverPicture ? (
                    <img
                        src={user.coverPicture}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"></div>
                )}

                {/* Edit Cover Button */}
                <button className="absolute bottom-4 right-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-2.5 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 group">
                    <FiCamera className="text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                </button>
            </div>

            {/* Profile Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-24 relative z-10">
                {/* Avatar Section */}
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 pb-6">
                    <div className="relative">
                        <div className="relative w-32 h-32 md:w-40 md:h-40 ring-4 ring-white dark:ring-gray-900 rounded-full overflow-hidden bg-white dark:bg-gray-800">
                            {isLoading ? (
                                <Skeleton circle height="100%" className="rounded-full" />
                            ) : user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                                    <span className="text-4xl font-bold text-white">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                        <button className="absolute bottom-2 right-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-2 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 group">
                            <FiCamera className="text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 text-sm" />
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center md:text-left">
                        {isLoading ? (
                            <>
                                <Skeleton width={200} height={30} className="mb-2 mx-auto md:mx-0" />
                                <Skeleton width={150} height={24} className="mx-auto md:mx-0" />
                            </>
                        ) : (
                            <>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                    {user?.username}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    @{user?.username}
                                </p>
                            </>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-4 justify-center md:justify-start">
                            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-purple-500/25 flex items-center gap-2">
                                <FiEdit size={14} />
                                Edit Profile
                            </button>
                            <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2">
                                Message
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bio and Details */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6 border border-gray-100 dark:border-gray-700">
                    {isLoading ? (
                        <>
                            <Skeleton count={3} className="mb-2" />
                            <div className="flex gap-4 mt-4 flex-wrap">
                                <Skeleton width={100} height={20} />
                                <Skeleton width={100} height={20} />
                                <Skeleton width={100} height={20} />
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                {user?.bio || "This user hasn't written a bio yet."}
                            </p>

                            {/* Details */}
                            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1.5">
                                    <FiMapPin size={16} />
                                    <span>Earth</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <FiLink size={16} />
                                    <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
                                        example.com
                                    </a>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <FiCalendar size={16} />
                                    <span>Joined April 2023</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-6 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">128</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Posts</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">3.2K</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">458</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Following</div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Content Tabs */}
                <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex space-x-8">
                        <button className="py-4 px-1 border-b-2 font-medium text-sm border-purple-500 text-purple-600 dark:text-purple-400">
                            Posts
                        </button>
                        <button className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                            Media
                        </button>
                        <button className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                            Likes
                        </button>
                    </nav>
                </div>

                {/* Posts Grid (Placeholder) */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                            <div className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30"></div>
                            <div className="p-4">
                                <h3 className="font-medium text-gray-900 dark:text-white">Post Title #{item}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                <div className="flex items-center mt-4 text-xs text-gray-500 dark:text-gray-500">
                                    <span>April 15, 2023</span>
                                    <span className="mx-2">•</span>
                                    <span>5 min read</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}