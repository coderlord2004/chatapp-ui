'use client';

import { useEffect, useState, use } from 'react';
import { useRequest } from '@/hooks/useRequest';
import { useAuth } from '@/contexts/AuthContext';
import { UserWithInvitation } from '@/types/User';
import { PostType } from '@/types/Post';
import { AttachmentType } from '@/types/Attachment';
import CoverPicture from '@/components/CoverPicture';
import RestrictedProfileView from '@/components/RestrictedProfileView';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileInfo from '@/components/ProfileInfo';
import ProfileTabs from '@/components/ProfileTabs';
import ProfileSkeleton from '@/components/Loading/ProfileSkeleton';

type ProfileType = {
	user: UserWithInvitation | null;
	posts: PostType[];
	media: AttachmentType[];
};

export default function Page({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const { username } = use(params);
	const { get } = useRequest();
	const { authUser } = useAuth();

	const [profile, setProfile] = useState<ProfileType>({
		user: null,
		posts: [],
		media: [],
	});
	const [activeTab, setActiveTab] = useState({ name: 'Posts', page: 1 });
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getUser = async () => {
			const data = await get('users/info/', { params: { username } });
			setProfile({ user: data, posts: [], media: [] });
			setIsLoading(false);
		};

		if (authUser) {
			if (authUser.username === username) {
				setProfile({
					user: { invitation: null, userWithInformation: authUser },
					posts: [],
					media: [],
				});
				setIsLoading(false);
			} else getUser();
		}
	}, [username, authUser]);

	const userData = profile.user?.userWithInformation;
	const restriction = profile.user?.invitation?.restriction ?? 'NONE';

	useEffect(() => {
		if (!userData) return;

		const fetchData = async () => {
			if (activeTab.name === 'Posts') {
				const data = await get(`posts/get/${username}`, {
					params: { page: activeTab.page },
				});
				setProfile((prev) => ({ ...prev, posts: data }));
			} else {
				const data = await get('users/medias/', {
					params: { userId: userData.id, page: activeTab.page },
				});
				setProfile((prev) => ({ ...prev, media: data }));
			}
		};

		fetchData();
	}, [activeTab, username, userData]);

	if (!userData) return <ProfileSkeleton />;

	if (restriction !== 'NONE')
		return (
			<RestrictedProfileView
				username={userData.username}
				avatar={userData.avatar}
			/>
		);

	return (
		<div className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-900">
			<CoverPicture src={userData.coverPicture || ''} />

			<div className="relative z-10 mx-auto -mt-16 max-w-4xl px-4 sm:px-6 md:-mt-24 lg:px-8">
				<ProfileHeader
					userData={userData}
					isLoading={isLoading}
					username={username}
				/>
				<ProfileInfo userData={userData} isLoading={isLoading} />
				<ProfileTabs
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					authUser={authUser}
					username={username}
					profile={profile}
					setProfile={setProfile}
				/>
			</div>
		</div>
	);
}
