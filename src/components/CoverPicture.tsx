import { FiCamera } from 'react-icons/fi';
import { useRequest } from '@/hooks/useRequest';
import { useState } from 'react';

type Props = {
	src: string | null;
};

export default function CoverPicture({ src }: Props) {
	const [url, setUrl] = useState<string | null>(src);
	const { post } = useRequest();
	async function handleUpdateCover(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files && e.target.files[0]) {
			const formData = new FormData();
			formData.append('coverPicture', e.target.files[0]);
			const data = await post('users/cover-picture/update/', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			setUrl(data.coverPicture);
		}
	}

	return (
		<div className="relative h-64 w-full overflow-hidden md:h-80">
			{src ? (
				<img
					src={url || ''}
					alt="Cover"
					className="h-full w-full object-cover"
				/>
			) : (
				<div className="h-full w-full bg-gradient-to-b from-slate-800 via-5% to-slate-300"></div>
			)}

			<label
				htmlFor='update-cover-picture'
				className="group absolute right-4 bottom-4 flex cursor-pointer items-center justify-center rounded-full bg-white/80 p-2.5 backdrop-blur-sm transition-all duration-300 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-700"
			>
				<FiCamera className="text-gray-700 group-hover:text-purple-600 dark:text-gray-300 dark:group-hover:text-purple-400" />
			</label>
			<input
				id='update-cover-picture'
				type="file"
				className='hidden'
				onChange={handleUpdateCover}
			/>
		</div>
	);
}
