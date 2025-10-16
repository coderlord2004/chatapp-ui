import { useEffect, useRef, useState } from 'react';
import { useRequest } from '@/hooks/useRequest';
import { PostType } from '@/types/Post';
import { useNotification } from '@/hooks/useNotification';
import Menu from './Menu';
import { MdPublic, MdClose, MdPalette } from 'react-icons/md';
import { FaUserFriends, FaPhotoVideo } from 'react-icons/fa';
import { IoIosCreate } from 'react-icons/io';
import { SiPrivateinternetaccess } from 'react-icons/si';
import Avatar from './Avatar';
import { useAuth } from '@/contexts/AuthContext';
import ThrobberLoader from './Loading/ThrobberLoader';
import Post from './Post';

type Props = {
	sharedPost?: PostType;
	onClose: () => void;
};

type AttachmentType = {
	file: File;
	description: string | null;
};

type VisibilityType = 'PUBLIC' | 'FRIEND' | 'PRIVATE';

type CreatePostData = {
	caption: string;
	captionBackground: number;
	visibility: VisibilityType;
	attachments: AttachmentType[];
};

type FileAttachmentType = {
	source: string;
	type: string;
	file: File;
};

const BACKGROUND_COLORS = [
	{ id: 0, name: 'Mặc định', class: 'bg-white' },
	{
		id: 1,
		name: 'Tím hồng',
		class: 'bg-gradient-to-r from-purple-500 to-pink-500',
	},
	{
		id: 2,
		name: 'Xanh dương',
		class: 'bg-gradient-to-r from-blue-400 to-cyan-400',
	},
	{
		id: 3,
		name: 'Xanh lá',
		class: 'bg-gradient-to-r from-green-400 to-teal-400',
	},
	{
		id: 4,
		name: 'Cam đỏ',
		class: 'bg-gradient-to-r from-orange-400 to-red-500',
	},
	{
		id: 5,
		name: 'Vàng cam',
		class: 'bg-gradient-to-r from-yellow-400 to-orange-400',
	},
	{
		id: 6,
		name: 'Hồng tím',
		class: 'bg-gradient-to-r from-pink-400 to-purple-500',
	},
	{
		id: 7,
		name: 'Xanh biển',
		class: 'bg-gradient-to-r from-blue-500 to-indigo-600',
	},
	{
		id: 8,
		name: 'Xanh tím',
		class: 'bg-gradient-to-r from-blue-500 to-purple-600',
	},
];

export default function CreatePost({ sharedPost, onClose }: Props) {
	const { post } = useRequest();
	const { showNotification } = useNotification();
	const { authUser } = useAuth();
	const [visibility, setVisibility] = useState<number>(0);
	const [attachments, setAttachments] = useState<FileAttachmentType[]>([]);
	const [selectedBackground, setSelectedBackground] = useState<number>(0);
	const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
	const [caption, setCaption] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	const createPostDataRef = useRef<CreatePostData>({
		caption: '',
		captionBackground: 0,
		visibility: 'PUBLIC',
		attachments: [],
	});

	const visibilities = [
		{
			title: 'Công khai',
			icon: <MdPublic className="text-blue-500" />,
			description: 'Ai cũng có thể xem',
			action: (index: number) => updateVisibility(index),
		},
		{
			title: 'Bạn bè',
			icon: <FaUserFriends className="text-green-500" />,
			description: 'Chỉ bạn bè có thể xem',
			action: (index: number) => updateVisibility(index),
		},
		{
			title: 'Chỉ mình tôi',
			icon: <SiPrivateinternetaccess className="text-gray-500" />,
			description: 'Chỉ bạn có thể xem',
			action: (index: number) => updateVisibility(index),
		},
	];

	function updateVisibility(index: number) {
		const visibilityValues: VisibilityType[] = ['PUBLIC', 'FRIEND', 'PRIVATE'];
		createPostDataRef.current.visibility = visibilityValues[index];
		setVisibility(index);
	}

	function handleBackgroundSelect(bgId: number) {
		setSelectedBackground(bgId);
		createPostDataRef.current.captionBackground = bgId;
		setShowColorPicker(false);
	}

	async function handleCreatePost() {
		if (!createPostDataRef.current) return;

		const createPostData = createPostDataRef.current;

		// Validate
		if (!createPostData.caption.trim()) {
			showNotification({
				type: 'error',
				message: 'Vui lòng nhập nội dung bài đăng',
			});
			return;
		}

		setLoading(true);
		if (sharedPost) {
			await post('posts/share/', {
				caption: createPostData.caption,
				visibility: createPostData.visibility,
				type: 'POST',
				postId: sharedPost.id,
			});
			setLoading(false);
		} else {
			const formData = new FormData();
			formData.append('caption', createPostData.caption);
			formData.append('visibility', createPostData.visibility);
			formData.append(
				'captionBackground',
				createPostData.captionBackground.toString(),
			);
			createPostData.attachments.forEach((att, i) => {
				if (att.description) {
					formData.append(`attachments[${i}].description`, att.description);
				}
				formData.append(`attachments[${i}].file`, att.file);
			});

			await post('posts/create/', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			setLoading(false);
		}
		showNotification({
			type: 'success',
			message: 'Bài đăng đã được đăng thành công!',
		});
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (!e.target.files) return;

		const newAttachments: FileAttachmentType[] = [];
		const files: File[] = Array.from(e.target.files);

		files.forEach((file) => {
			newAttachments.push({
				source: URL.createObjectURL(file),
				type: file.type,
				file: file,
			});
			createPostDataRef.current.attachments.push({
				file: file,
				description: null,
			});
		});
		setAttachments((prev) => [...prev, ...newAttachments]);
	}

	function removeAttachment(index: number) {
		setAttachments((prev) => prev.filter((_, i) => i !== index));
		createPostDataRef.current.attachments =
			createPostDataRef.current.attachments.filter((_, i) => i !== index);
	}

	function handleCaptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		const value = e.target.value;
		setCaption(value);
		createPostDataRef.current.caption = value;
	}

	useEffect(() => {
		return () => {
			attachments.forEach((att) => URL.revokeObjectURL(att.source));
		};
	}, []);

	return (
		<div className="fixed inset-0 z-50 flex h-[100vh] w-[100vw] items-center justify-center bg-black/70 p-4">
			<div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
				<div className="relative flex items-center justify-between border-b border-gray-200 p-4">
					<div className="m-auto flex items-center gap-2 text-xl font-bold text-gray-900">
						<h1>{sharedPost ? 'Chia sẻ bài đăng' : 'Tạo bài đăng'}</h1>
						<IoIosCreate className="text-2xl text-cyan-400" />
					</div>
					<button
						onClick={onClose}
						className="absolute top-[50%] right-4 -translate-y-[50%] cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-100"
					>
						<MdClose className="text-2xl text-gray-600" />
					</button>
				</div>

				<div className="flex items-center gap-3 p-4">
					<Avatar
						author={authUser?.username || ''}
						src={authUser?.avatar || ''}
						className="h-12 w-12"
					/>
					<div className="flex-1">
						<p className="font-semibold text-gray-900">{authUser?.username}</p>
						<Menu data={visibilities}>
							<button className="flex cursor-pointer items-center gap-1 rounded-lg border border-gray-300 px-3 py-1 transition-colors hover:bg-gray-50">
								{visibilities[visibility].icon}
								<span className="text-sm text-gray-700">
									{visibilities[visibility].title}
								</span>
							</button>
						</Menu>
					</div>
				</div>

				<div className="relative p-4">
					<textarea
						value={caption}
						onChange={handleCaptionChange}
						placeholder={`${sharedPost ? 'Hãy nói gì đó về bài đăng này.' : `${authUser?.username} ơi, bạn đang nghĩ gì thế?`}`}
						className={`min-h-[120px] w-full resize-none rounded-lg border-[1px] border-solid border-slate-400 p-4 text-black placeholder-black/80 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:outline-none ${BACKGROUND_COLORS[selectedBackground].class}`}
					/>

					{!sharedPost && (
						<div className="absolute right-4 bottom-4">
							<button
								onClick={() => setShowColorPicker(!showColorPicker)}
								className="cursor-pointer rounded-full bg-gradient-to-r from-blue-600 to-pink-600 p-2 backdrop-blur-sm transition-all duration-200 hover:bg-white/30"
							>
								<MdPalette className="text-xl" />
							</button>

							{showColorPicker && (
								<div className="animate-fadeIn absolute right-0 bottom-12 z-10 w-64 rounded-xl bg-white p-4 shadow-2xl">
									<h3 className="mb-3 font-semibold text-gray-900">
										Chọn màu nền
									</h3>
									<div className="grid grid-cols-4 gap-2">
										{BACKGROUND_COLORS.map((color) => (
											<button
												key={color.id}
												onClick={() => handleBackgroundSelect(color.id)}
												className={`h-12 cursor-pointer rounded-lg transition-all duration-200 hover:scale-110 ${
													color.class
												} ${
													selectedBackground === color.id
														? 'ring-2 ring-blue-500 ring-offset-2'
														: ''
												}`}
												title={color.name}
											/>
										))}
									</div>
								</div>
							)}
						</div>
					)}
				</div>
				{attachments.length > 0 && (
					<div className="px-4 pb-4">
						<div
							className={`grid gap-2 ${
								attachments.length === 1
									? 'grid-cols-1'
									: attachments.length === 2
										? 'grid-cols-2'
										: 'grid-cols-3'
							}`}
						>
							{attachments.map((attachment, index) => (
								<div key={index} className="group relative">
									{attachment.type.startsWith('image/') ? (
										<img
											src={attachment.source}
											alt=""
											className="h-[200px] w-full rounded-lg object-cover"
										/>
									) : (
										<video
											src={attachment.source}
											className="h-32 w-full rounded-lg object-cover"
											controls
										/>
									)}
									<button
										onClick={() => removeAttachment(index)}
										className="absolute -top-2 -right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
									>
										<MdClose className="text-sm" />
									</button>
								</div>
							))}
						</div>
					</div>
				)}
				{sharedPost ? (
					<div className="w-full px-5">
						<Post data={sharedPost} />
					</div>
				) : (
					<div className="border-t border-gray-200 p-4">
						<label className="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors hover:bg-slate-300">
							<FaPhotoVideo className="text-2xl text-green-500" />
							<span className="font-medium text-gray-700">Thêm ảnh/video</span>
							<input
								type="file"
								className="hidden"
								multiple
								accept="image/*,video/*"
								onChange={handleFileChange}
							/>
						</label>
					</div>
				)}

				<div className="relative border-t border-gray-200 p-4">
					<button
						onClick={handleCreatePost}
						disabled={!caption.trim()}
						className={`w-full cursor-pointer rounded-lg px-6 py-3 font-semibold transition-all duration-200 ${
							caption.trim()
								? 'transform bg-blue-500 text-white shadow-lg hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-xl'
								: 'cursor-not-allowed bg-gray-300 text-gray-500'
						}`}
					>
						Đăng
					</button>

					{loading && (
						<div className="absolute inset-[16px] flex items-center justify-center rounded-lg bg-black/70">
							<ThrobberLoader />
						</div>
					)}
				</div>
			</div>

			<div className="overlay" onClick={onClose}></div>
		</div>
	);
}
