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
};
type UserWithAvatar = {
	id: number;
	username: string;
	avatar: string | null;
	isOnline: boolean;
};
type UserSearchResult = {
	userDto: UserWithAvatar;
	invitationDto: Invitation | null;
};

export type { UserInfo, UserWithAvatar, UserSearchResult };
