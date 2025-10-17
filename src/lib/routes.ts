export const routes = {
	home: '/',
	login: '/login',
	register: '/signup',
	profile: (username: string) => `/profile/${username}`,
	nextchat: '/nextchat',
	message: (username: string) => `/nextchat?username=${username}`,
	nextvibes: '/nextvibes',
};
