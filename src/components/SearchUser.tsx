import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdPersonAddAlt1, MdCheck, MdBlock, MdPersonOff } from 'react-icons/md';
import { useRequest } from '@/hooks/useRequest';
import { UserWithInvitation } from '@/types/User';
import Avatar from './Avatar';
import { useAuth } from '@/contexts/AuthContext';

type Props = {
	chatGroupId: number | null;
	onClose: () => void;
};

export default function SearchUser({ chatGroupId, onClose }: Props) {
	const { authUser } = useAuth();
	const { get, post } = useRequest();
	const [userSearchResults, setUserSearchResults] = useState<UserWithInvitation[] | null>(null);
	const [searchUserLoading, setSearchUserLoading] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const searchInput = useRef<HTMLInputElement | null>(null);

	const sendInvitation = async (receiverName: string, roomId = null) => {
		if (!receiverName) return;
		await post('invitations', {
			receiverUserName: receiverName,
			chatGroupId: roomId || chatGroupId,
		});
	};

	useEffect(() => {
		if (searchInput.current) {
			searchInput.current.focus();
		}
	}, []);

	useEffect(() => {
		const delayDebounce = setTimeout(async () => {
			if (searchTerm.trim() === '') {
				setUserSearchResults(null);
				return;
			}

			setSearchUserLoading(true);
			const data = await get(`users/search/`, {
				params: {
					q: searchTerm,
				},
			});
			setUserSearchResults(data);
			setSearchUserLoading(false);
		}, 300);

		return () => clearTimeout(delayDebounce);
	}, [get, searchTerm]);

	const getStatusInfo = (user: UserWithInvitation) => {
		if (!user.invitation) {
			return {
				text: 'Thêm bạn bè',
				icon: <MdPersonAddAlt1 className="w-5 h-5" />,
				color: 'from-blue-500 to-cyan-500',
				hoverColor: 'hover:from-blue-600 hover:to-cyan-600',
				action: () => sendInvitation(user.userWithInformation.username)
			};
		}

		if (user.invitation?.restriction) {
			return {
				text: user.invitation.sender.id === authUser?.id ? 'Bạn đã chặn' : 'Đã bị chặn',
				icon: <MdBlock className="w-5 h-5" />,
				color: 'from-red-500 to-pink-500',
				hoverColor: '',
				action: null
			};
		}

		switch (user.invitation?.status) {
			case 'PENDING':
				return {
					text: 'Đã gửi lời mời',
					icon: <MdCheck className="w-5 h-5" />,
					color: 'from-amber-500 to-orange-500',
					hoverColor: '',
					action: null
				};
			case 'ACCEPTED':
				return {
					text: 'Bạn bè',
					icon: <MdCheck className="w-5 h-5" />,
					color: 'from-green-500 to-emerald-500',
					hoverColor: '',
					action: null
				};
			default:
				return {
					text: user.invitation.sender.id === authUser?.id ? 'Bạn đã từ chối' : 'Đã từ chối bạn',
					icon: <MdPersonOff className="w-5 h-5" />,
					color: 'from-gray-500 to-slate-500',
					hoverColor: '',
					action: null
				};
		}
	};

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
			>
				<motion.div
					initial={{ scale: 0.9, opacity: 0, y: 20 }}
					animate={{ scale: 1, opacity: 1, y: 0 }}
					exit={{ scale: 0.9, opacity: 0, y: 20 }}
					transition={{ type: "spring", damping: 25, stiffness: 300 }}
					className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl w-full max-w-md border border-white/10 shadow-2xl overflow-hidden"
					onClick={(e) => e.stopPropagation()}
				>
					{/* Header */}
					<div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
								Tìm kiếm người dùng
							</h2>
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								onClick={onClose}
								className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200"
							>
								<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</motion.button>
						</div>

						{/* Search Input */}
						<div className="relative mt-4">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
								</svg>
							</div>
							<input
								ref={searchInput}
								type="text"
								name="searchingUsername"
								placeholder="Nhập username để tìm kiếm..."
								className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-200/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-300"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
					</div>

					{/* Results */}
					<div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
						<AnimatePresence mode="wait">
							{searchUserLoading ? (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="flex justify-center items-center py-12"
								>
									<div className="flex flex-col items-center space-y-3">
										<div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
										<p className="text-purple-200/60 text-sm">Đang tìm kiếm...</p>
									</div>
								</motion.div>
							) : userSearchResults ? (
								userSearchResults.length > 0 ? (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className="p-4 space-y-3"
									>
										{userSearchResults.map((user, index) => {
											const statusInfo = getStatusInfo(user);
											return (
												<motion.div
													key={user.userWithInformation.id}
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ delay: index * 0.1 }}
													className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-300 group"
												>
													<div className="flex items-center space-x-3">
														<Avatar
															author={user.userWithInformation.username}
															src={user.userWithInformation?.avatar || ''}
															className="h-12 w-12 ring-2 ring-purple-500/30 group-hover:ring-purple-500/50 transition-all duration-300"
															controls={false}
														/>
														<div>
															<p className="font-semibold text-white group-hover:text-purple-100 transition-colors">
																{user.userWithInformation.username}
															</p>
															<p className="text-sm text-purple-200/60">
																{user.userWithInformation.bio}
															</p>
														</div>
													</div>

													{statusInfo.action ? (
														<motion.button
															whileHover={{ scale: 1.05 }}
															whileTap={{ scale: 0.95 }}
															onClick={statusInfo.action}
															className={`bg-gradient-to-r ${statusInfo.color} ${statusInfo.hoverColor} text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40`}
														>
															{statusInfo.icon}
															<span className="text-sm font-medium">{statusInfo.text}</span>
														</motion.button>
													) : (
														<div className={`bg-gradient-to-r ${statusInfo.color} text-white px-4 py-2 rounded-xl flex items-center space-x-2 shadow-lg`}>
															{statusInfo.icon}
															<span className="text-sm font-medium">{statusInfo.text}</span>
														</div>
													)}
												</motion.div>
											);
										})}
									</motion.div>
								) : (
									<motion.div
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.9 }}
										className="flex flex-col items-center justify-center py-12 px-6 text-center"
									>
										<div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
											<svg className="w-10 h-10 text-purple-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
										</div>
										<h3 className="text-lg font-semibold text-white mb-2">
											Không tìm thấy người dùng
										</h3>
										<p className="text-purple-200/60 text-sm">
											Hãy thử tìm kiếm với username khác
										</p>
									</motion.div>
								)
							) : (
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.9 }}
									className="flex flex-col items-center justify-center py-12 px-6 text-center"
								>
									<div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
										<svg className="w-10 h-10 text-blue-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
										</svg>
									</div>
									<h3 className="text-lg font-semibold text-white mb-2">
										Tìm kiếm bạn bè
									</h3>
									<p className="text-blue-200/60 text-sm">
										Nhập username để tìm kiếm và thêm bạn bè
									</p>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{/* Footer */}
					<div className="p-4 border-t border-white/10 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
						<p className="text-center text-purple-200/60 text-sm">
							Tìm kiếm và kết nối với bạn bè
						</p>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}