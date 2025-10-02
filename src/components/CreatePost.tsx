import { useRef, useState } from 'react';
import { useRequest } from '@/hooks/useRequest';
import { PostType } from '@/types/Post';
import { useNotification } from '@/hooks/useNotification';
import Menu from './Menu';
import { MdPublic } from 'react-icons/md';
import { FaUserFriends } from 'react-icons/fa';
import { SiPrivateinternetaccess } from 'react-icons/si';
import Avatar from './Avatar';
import { useAuth } from '@/contexts/AuthContext';
import { FaPhotoVideo } from 'react-icons/fa';

type Props = {
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
};

export default function CreatePost({ onClose }: Props) {
	const { post } = useRequest();
	const { showNotification } = useNotification();
	const { authUser } = useAuth();
	const [visibility, setVisibility] = useState<number>(0);
	const [attachments, setAttachments] = useState<FileAttachmentType[]>([]);
	const createPostDataRef = useRef<CreatePostData>({
		caption: '',
		captionBackground: 0,
		visibility: 'PUBLIC',
		attachments: [],
	});
	const visibilities = [
		{
			title: 'Công khai',
			icon: <MdPublic />,
			action: (index: number) => updateVisibility(index),
		},
		{
			title: 'Bạn bè',
			icon: <FaUserFriends />,
			action: (index: number) => updateVisibility(index),
		},
		{
			title: 'Chỉ mình tôi',
			icon: <SiPrivateinternetaccess />,
			action: (index: number) => updateVisibility(index),
		},
	];
	function updateVisibility(index: number) {
		const visibilityValues: VisibilityType[] = ['PUBLIC', 'FRIEND', 'PRIVATE'];
		createPostDataRef.current.visibility = visibilityValues[index];
		setVisibility(index);
	}
	async function handleCreatePost() {
		if (!createPostDataRef.current) return;

		const createPostData = createPostDataRef.current;

		const formData = new FormData();
		formData.append('caption', createPostData.caption);
		formData.append(
			'captionBackground',
			createPostData.captionBackground.toString(),
		);
		formData.append('visibility', createPostData.visibility);

		createPostData.attachments.forEach((att, i) => {
			formData.append(`attachments[${i}].file`, att.file);
			formData.append(`attachments[${i}].description`, att.description ?? '');
		});

		await post('posts/create/', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});

		showNotification({
			type: 'success',
			message: 'Đã đăng!',
		});
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (!e.target.files) return;
		console.log(e.target.files);

		const newAttachments: FileAttachmentType[] = [];
		const files: File[] = Array.from(e.target.files);
		console.log('files', files);

		files.forEach((file) => {
			newAttachments.push({
				source: URL.createObjectURL(file),
				type: file.type,
			});
			createPostDataRef.current.attachments.push({
				file: file,
				description: 'haha',
			});
		});
		setAttachments((prev) => [...prev, ...newAttachments]);
	}
	const getCaptionBackground = (bgType: number) => {
		const backgrounds = [
			'none',
			'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
			'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
			'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
			'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
			'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
			'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
		];
		return backgrounds[bgType % backgrounds.length];
	};

	return (
		<div className="fixed inset-0 flex bg-black/70 py-[20px]">
			<div className="mx-auto flex w-[400px] flex-col rounded-[7px] bg-blue-500 p-[10px] sm:w-[500px]">
				<h1 className="text-center text-3xl">Tạo bài đăng</h1>
				<div className="flex w-full items-center gap-[10px]">
					<Avatar
						author={authUser?.username || ''}
						src={authUser?.avatar || ''}
						className="h-[50px] w-[50px]"
					/>
					<div>
						<p>{authUser?.username}</p>
						<Menu data={visibilities}>
							<div className="flex items-center justify-center gap-[10px]">
								<p>{visibilities[visibility].title}</p>
								<MdPublic className="text-2xl" />
							</div>
						</Menu>
					</div>
				</div>
				<form action="">
					<div className="flex h-[50px] w-full items-center justify-center gap-[10px]">
						<input
							type="text"
							className="w-full text-white outline-none"
							placeholder="Tiêu đề"
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								createPostDataRef.current.caption = e.target.value;
							}}
						/>
						<div
							className="h-[40px] w-[40px] cursor-pointer rounded-[8px] border-[1px] border-solid border-gray-400"
							style={{
								background: getCaptionBackground(1),
							}}
						></div>
					</div>
				</form>
				<div className="cursor-pointer text-3xl text-green-300">
					<label htmlFor="attachment-input">
						<FaPhotoVideo />
					</label>
					<input
						id="attachment-input"
						type="file"
						className="hidden"
						multiple
						onChange={handleFileChange}
					/>
				</div>

				<div className="flex w-full">
					{attachments.map((attachment, index) =>
						attachment.type.startsWith('image/') ? (
							<img
								key={index}
								src={attachment.source}
								alt=""
								className="h-[20px] w-[20px]"
							/>
						) : (
							<video
								key={index}
								src={attachment.source}
								className="h-[20px] w-[20px]"
							></video>
						),
					)}
				</div>

				<div>
					<button onClick={handleCreatePost}>Đăng</button>
				</div>
			</div>

			<div className="overlay" onClick={onClose}></div>
		</div>
	);
}
