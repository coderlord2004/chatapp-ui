import { useState, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { HiUserGroup } from 'react-icons/hi2';
import Menu from './Menu';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRequest } from '@/hooks/useRequest';
import Throbber from './Loading/ThrobberLoader';
import { useNotification } from '@/hooks/useNotification';

type Props = {
	author: string;
	src: string | null;
	className: string;
	square?: boolean;
	isGroupAvatar?: boolean;
	controls?: boolean;
	onClose?: () => void;
};

export default function Avatar({
	author,
	src,
	className,
	square = false,
	controls = true,
	isGroupAvatar = false,
	onClose,
}: Props) {
	const [avatarUrl, setAvatarUrl] = useState<string | null>(src);
	const { authUser, logout } = useAuth();
	const { post } = useRequest();
	const router = useRouter();
	const { showNotification } = useNotification();
	const [isViewAvatar, setIsViewAvatar] = useState(false);
	const [loading, setLoading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	async function blockUser(userId: number) {
		await post('users/block/', {
			params: {
				userId,
			},
		});
	}

	const menuData = [
		{
			title: 'Xem trang cá nhân',
			action: () => {
				router.push(`/profile/${author}`);
				onClose?.();
			},
		},
		{
			accepted: true,
			title: 'Xem ảnh đại diện',
			action: () => setIsViewAvatar(true),
		},
		{
			accepted: author === authUser?.username,
			title: 'Chỉnh sửa ảnh đại diện',
			action: () => fileInputRef.current?.click(),
		},
		{
			accepted: author !== authUser?.username,
			title: 'Chặn',
			action: () => {
				blockUser(1);
			},
		},
		{
			accepted: author === authUser?.username,
			title: 'Đăng xuất',
			action: () => logout(),
		},
	];

	async function handleUpdateAvatar(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files && e.target.files[0]) {
			const formData = new FormData();
			formData.append('avatar', e.target.files[0]);
			setLoading(true);
			const data = await post('users/avatar/update/', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			setAvatarUrl(data.avatarUrl);
			setLoading(false);
			showNotification({
				type: 'success',
				message: 'Cập nhật ảnh đại diện thành công',
			});
		}
	}

	return (
		<div
			className={
				className +
				' relative cursor-pointer rounded-[50%] text-black dark:text-white'
			}
		>
			<input
				type="file"
				accept="image/*"
				className="hidden"
				ref={fileInputRef}
				onChange={handleUpdateAvatar}
			/>

			{loading && (
				<div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-[50%] bg-black/70">
					<Throbber />
				</div>
			)}

			{controls ? (
				<Menu data={menuData}>
					<div
						className={
							className +
							` flex cursor-pointer items-center justify-center ${square ? 'relative rounded-[10px]' : 'rounded-[50%]'} group`
						}
					>
						{avatarUrl ? (
							<>
								{/* Ảnh chính */}
								<img
									src={avatarUrl}
									alt=""
									className={`h-full w-full object-cover ${square ? 'relative rounded-[10px]' : 'rounded-[50%]'}`}
									style={{
										boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)',
										filter: 'contrast(1.05) saturate(1.1)',
									}}
								/>

								{square && avatarUrl && (
									<div className="absolute top-3 left-3 -z-1 h-full w-full rounded-[10px]">
										<img
											src={avatarUrl}
											alt=""
											className={`h-full w-full rounded-[10px] object-cover`}
											style={{
												filter: 'blur(2px) brightness(0.7)',
											}}
										/>
									</div>
								)}
							</>
						) : isGroupAvatar ? (
							<HiUserGroup className="h-full w-full text-3xl" />
						) : (
							<FaUserCircle className="h-full w-full text-3xl" />
						)}
					</div>
				</Menu>
			) : (
				<div
					className={
						'flex cursor-pointer items-center justify-center rounded-[50%] ' +
						className
					}
				>
					{avatarUrl ? (
						<img
							src={avatarUrl}
							alt=""
							className="h-full w-full object-cover"
						/>
					) : isGroupAvatar ? (
						<HiUserGroup className="h-full w-full text-3xl" />
					) : (
						<FaUserCircle className="h-full w-full text-3xl" />
					)}
				</div>
			)}

			{isViewAvatar && (
				<div
					className="fixed inset-0 z-50 flex h-full w-full bg-black/70 p-4"
					onClick={() => setIsViewAvatar(false)}
				>
					<img
						src={avatarUrl || ''}
						alt=""
						className="m-auto max-h-full max-w-full object-contain"
					/>
				</div>
			)}
		</div>
	);
}
