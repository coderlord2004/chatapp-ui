'use client';
import { PostType } from '@/types/Post';
import { AttachmentType } from '@/types/Attachment';
import Post from '@/components/Post';
import Attachment from '@/components/Attachment';
import PostComposerTrigger from '@/components/PostComposerTrigger';

type Props = {
	activeTab: { name: string; page: number };
	setActiveTab: (tab: { name: string; page: number }) => void;
	authUser?: any;
	username: string;
	profile: { posts: PostType[]; media: AttachmentType[] };
	setProfile: Function;
};

const tabs = [
	{ name: 'Posts', page: 1 },
	{ name: 'Media', page: 1 },
];

export default function ProfileTabs({
	activeTab,
	setActiveTab,
	authUser,
	username,
	profile,
	setProfile,
}: Props) {
	return (
		<>
			<div className="mt-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
				<nav className="flex space-x-8">
					{tabs.map((tab) => (
						<button
							key={tab.name}
							className={`cursor-pointer border-b-2 ${
								tab.name === activeTab.name
									? 'border-purple-500 px-1 py-4 text-sm font-medium text-purple-600 dark:text-purple-400'
									: 'border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
							}`}
							onClick={() => setActiveTab({ ...activeTab, name: tab.name })}
						>
							{tab.name}
						</button>
					))}
				</nav>

				{authUser && authUser.username === username && (
					<PostComposerTrigger
						onCreatePost={(data) =>
							setProfile((prev: any) => ({
								...prev,
								posts: [data, ...prev.posts],
							}))
						}
					/>
				)}
			</div>

			<div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
				{activeTab.name === 'Posts'
					? profile.posts.map((post) => (
							<Post
								key={post.id}
								data={post}
								onRemove={(id) =>
									setProfile((prev: any) => ({
										...prev,
										posts: prev.posts.filter((p: any) => p.id !== id),
									}))
								}
							/>
						))
					: profile.media.map((media) => (
							<Attachment key={media.id} attachment={media} />
						))}
			</div>
		</>
	);
}
