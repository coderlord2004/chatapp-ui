import Avatar from './Avatar';

export default function RestrictedProfileView({
	username,
	avatar,
}: {
	username: string;
	avatar?: string | null;
}) {
	return (
		<div className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-900">
			<div className="avatar relative mt-6 flex flex-col items-center">
				<div className="relative h-32 w-32 md:h-40 md:w-40">
					{avatar ? (
						<Avatar
							author={username}
							src={avatar}
							className="h-full w-full"
							square
							controls
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-cyan-400 to-blue-500">
							<span className="text-4xl font-bold text-white">
								{username.charAt(0).toUpperCase()}
							</span>
						</div>
					)}
				</div>
				<h1 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
					{username}
				</h1>
				<p className="mt-1 text-gray-600 dark:text-gray-400">@{username}</p>
				<p className="mt-4 text-sm text-gray-500 italic dark:text-gray-400">
					Bạn không thể xem thông tin chi tiết của người dùng này do hạn chế
					quyền.
				</p>
			</div>
		</div>
	);
}
