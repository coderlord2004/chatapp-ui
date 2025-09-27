export const routes = {
	home: '/',
	login: '/login',
	register: '/signup',
	profile: (username: string) => `/profile/${username}`,
	nextchat: '/nextchat',
	nextvibes: '/nextvibes',
};
