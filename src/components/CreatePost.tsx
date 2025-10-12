import { useEffect, useRef, useState } from 'react';
import { useRequest } from '@/hooks/useRequest';
import { PostType } from '@/types/Post';
import { useNotification } from '@/hooks/useNotification';
import Menu from './Menu';
import { MdPublic, MdClose, MdPalette } from 'react-icons/md';
import { FaUserFriends, FaPhotoVideo } from 'react-icons/fa';
import { IoIosCreate } from "react-icons/io";
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
	{ id: 1, name: 'Tím hồng', class: 'bg-gradient-to-r from-purple-500 to-pink-500' },
	{ id: 2, name: 'Xanh dương', class: 'bg-gradient-to-r from-blue-400 to-cyan-400' },
	{ id: 3, name: 'Xanh lá', class: 'bg-gradient-to-r from-green-400 to-teal-400' },
	{ id: 4, name: 'Cam đỏ', class: 'bg-gradient-to-r from-orange-400 to-red-500' },
	{ id: 5, name: 'Vàng cam', class: 'bg-gradient-to-r from-yellow-400 to-orange-400' },
	{ id: 6, name: 'Hồng tím', class: 'bg-gradient-to-r from-pink-400 to-purple-500' },
	{ id: 7, name: 'Xanh biển', class: 'bg-gradient-to-r from-blue-500 to-indigo-600' },
	{ id: 8, name: 'Xanh tím', class: 'bg-gradient-to-r from-blue-500 to-purple-600' },
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
				sharedPostId: sharedPost.id
			});
		} else {
			const formData = new FormData();
			formData.append('caption', createPostData.caption);
			formData.append('visibility', createPostData.visibility);
			formData.append('captionBackground', createPostData.captionBackground.toString());
			createPostData.attachments.forEach((att, i) => {
				if (att.description) {
					formData.append(`attachments[${i}].description`, att.description);
				}
				formData.append(`attachments[${i}].file`, att.file);
			});

			await post('posts/create/', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
		}
		setLoading(false);
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
		setAttachments(prev => prev.filter((_, i) => i !== index));
		createPostDataRef.current.attachments = createPostDataRef.current.attachments.filter((_, i) => i !== index);
	}

	function handleCaptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		const value = e.target.value;
		setCaption(value);
		createPostDataRef.current.caption = value;
	}

	useEffect(() => {
		return () => {
			attachments.forEach(att => URL.revokeObjectURL(att.source));
		}
	}, [])

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
			<div className="bg-white rounded-2xl w-full max-w-2xl overflow-y-auto max-h-[90vh] shadow-2xl relative z-10">
				<div className="flex items-center justify-between p-4 border-b border-gray-200 relative">
					<div className="m-auto text-xl font-bold text-gray-900 flex items-center gap-2">
						<h1>{sharedPost ? 'Chia sẻ bài đăng' : 'Tạo bài đăng'}</h1>
						<IoIosCreate className='text-cyan-400 text-2xl' />
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer absolute top-[50%] right-4 -translate-y-[50%]"
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
							<button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
								{visibilities[visibility].icon}
								<span className="text-sm text-gray-700">{visibilities[visibility].title}</span>
							</button>
						</Menu>
					</div>
				</div>

				<div className="relative p-4">
					<textarea
						value={caption}
						onChange={handleCaptionChange}
						placeholder={`${sharedPost ? 'Hãy nói gì đó về bài đăng này.' : `${authUser?.username} ơi, bạn đang nghĩ gì thế?`}`}
						className={`w-full min-h-[120px] p-4 rounded-lg text-black placeholder-black/80 resize-none border-[1px] border-solid border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${BACKGROUND_COLORS[selectedBackground].class}`}
					/>

					{!sharedPost && (
						<div className="absolute bottom-4 right-4">
							<button
								onClick={() => setShowColorPicker(!showColorPicker)}
								className="p-2 bg-gradient-to-r from-blue-600 to-pink-600 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all duration-200 cursor-pointer"
							>
								<MdPalette className="text-xl " />
							</button>

							{showColorPicker && (
								<div className="absolute bottom-12 right-0 bg-white rounded-xl shadow-2xl p-4 w-64 z-10 animate-fadeIn">
									<h3 className="font-semibold text-gray-900 mb-3">Chọn màu nền</h3>
									<div className="grid grid-cols-4 gap-2">
										{BACKGROUND_COLORS.map((color) => (
											<button
												key={color.id}
												onClick={() => handleBackgroundSelect(color.id)}
												className={`h-12 rounded-lg transition-all duration-200 hover:scale-110 cursor-pointer ${color.class
													} ${selectedBackground === color.id
														? 'ring-2 ring-offset-2 ring-blue-500'
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
						<div className={`grid gap-2 ${attachments.length === 1 ? 'grid-cols-1' :
							attachments.length === 2 ? 'grid-cols-2' :
								'grid-cols-3'
							}`}>
							{attachments.map((attachment, index) => (
								<div key={index} className="relative group">
									{attachment.type.startsWith('image/') ? (
										<img
											src={attachment.source}
											alt=""
											className="w-full h-[200px] object-cover rounded-lg"
										/>
									) : (
										<video
											src={attachment.source}
											className="w-full h-32 object-cover rounded-lg"
											controls
										/>
									)}
									<button
										onClick={() => removeAttachment(index)}
										className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
									>
										<MdClose className="text-sm" />
									</button>
								</div>
							))}
						</div>
					</div>
				)}
				{sharedPost ? (
					<div className='w-full px-5'>
						<Post data={sharedPost} />
					</div>
				) : (
					<div className="p-4 border-t border-gray-200">
						<label className="flex items-center gap-2 cursor-pointer hover:bg-slate-300 p-2 rounded-lg transition-colors">
							<FaPhotoVideo className="text-2xl text-green-500" />
							<span className="text-gray-700 font-medium">Thêm ảnh/video</span>
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


				<div className="p-4 border-t border-gray-200 relative">
					<button
						onClick={handleCreatePost}
						disabled={!caption.trim()}
						className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${caption.trim()
							? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
							: 'bg-gray-300 text-gray-500 cursor-not-allowed'
							}`}
					>
						Đăng
					</button>

					{loading && (
						<div className="absolute inset-[16px] bg-black/70 flex justify-center items-center rounded-lg">
							<ThrobberLoader />
						</div>
					)}
				</div>
			</div>

			<div
				className='overlay'
				onClick={onClose}
			></div>
		</div>
	);
}