import { Invitation } from './Invitation';

type UserInfo = {
	id: number;
	username: string;
	bio: string | null;
	avatar: string | null;
	coverPicture: string | null;
	totalFollowers: number;
	totalFollowing: number;
	totalPosts: number;
	createdAt: string;
	isOnline: boolean;
};
type UserWithAvatar = {
	id: number;
	username: string;
	avatar: string | null;
	isOnline: boolean;
};
type UserSearchResult = {
	userData: UserInfo;
	invitation: Invitation | null;
};

export type { UserInfo, UserWithAvatar, UserSearchResult };
