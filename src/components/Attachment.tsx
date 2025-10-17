import { AttachmentType } from '@/types/Attachment';

import React from 'react';
import {
	FaFileAlt,
	FaImage,
	FaVideo,
	FaMusic,
	FaFile,
	FaDownload,
	FaTrash,
	FaEye,
	FaFilePdf,
	FaFileWord,
	FaFileExcel,
	FaFilePowerpoint,
} from 'react-icons/fa';

interface AttachmentProps {
	attachment: AttachmentType;
	onView?: (attachment: AttachmentType) => void;
	onDownload?: (attachment: AttachmentType) => void;
	onDelete?: (attachment: AttachmentType) => void;
	className?: string;
	showActions?: boolean;
}

const Attachment: React.FC<AttachmentProps> = ({
	attachment,
	onView,
	onDownload,
	onDelete,
	className = '',
	showActions = true,
}) => {
	// Hàm lấy icon theo type và format
	const getFileIcon = () => {
		const iconClass = 'text-xl';

		// Xử lý document types chi tiết hơn
		if (attachment.type === 'DOCUMENT') {
			const format = attachment.format.toLowerCase();
			if (format.includes('pdf'))
				return <FaFilePdf className={`${iconClass} text-red-500`} />;
			if (format.includes('word') || format.includes('doc'))
				return <FaFileWord className={`${iconClass} text-blue-600`} />;
			if (format.includes('excel') || format.includes('xls'))
				return <FaFileExcel className={`${iconClass} text-green-600`} />;
			if (format.includes('powerpoint') || format.includes('ppt'))
				return <FaFilePowerpoint className={`${iconClass} text-orange-500`} />;
			return <FaFileAlt className={`${iconClass} text-orange-500`} />;
		}

		switch (attachment.type) {
			case 'IMAGE':
				return <FaImage className={`${iconClass} text-blue-500`} />;
			case 'VIDEO':
				return <FaVideo className={`${iconClass} text-purple-500`} />;
			case 'AUDIO':
				return <FaMusic className={`${iconClass} text-green-500`} />;
			case 'RAW':
				return <FaFile className={`${iconClass} text-gray-500`} />;
			default:
				return <FaFile className={`${iconClass} text-gray-500`} />;
		}
	};

	// Hàm lấy màu nền theo type
	const getTypeColor = () => {
		switch (attachment.type) {
			case 'IMAGE':
				return 'bg-blue-50 border-blue-200';
			case 'VIDEO':
				return 'bg-purple-50 border-purple-200';
			case 'AUDIO':
				return 'bg-green-50 border-green-200';
			case 'DOCUMENT':
				return 'bg-orange-50 border-orange-200';
			default:
				return 'bg-gray-50 border-gray-200';
		}
	};

	// Format file size (giả sử có thêm trường size)
	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	// Lấy tên file không bao gồm extension
	const getFileNameWithoutExtension = (filename: string) => {
		return filename.replace(/\.[^/.]+$/, '');
	};

	// Lấy extension từ tên file
	const getFileExtension = (filename: string) => {
		return filename.split('.').pop()?.toUpperCase() || '';
	};

	return (
		<div
			className={`rounded-lg border p-4 ${getTypeColor()} transition-all duration-200 hover:shadow-md ${className}`}
		>
			<div className="mb-3 flex items-start justify-between">
				<div className="flex min-w-0 flex-1 items-center space-x-3">
					<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border bg-white">
						{getFileIcon()}
					</div>
					<div className="min-w-0 flex-1">
						<h3
							className="truncate font-medium text-gray-900"
							title={attachment.name}
						>
							{getFileNameWithoutExtension(attachment.name)}
						</h3>
						<div className="mt-1 flex items-center space-x-2">
							<span className="rounded border bg-white px-2 py-1 text-xs text-gray-500">
								{getFileExtension(attachment.name) ||
									attachment.format.toUpperCase()}
							</span>
							<span className="text-sm text-gray-500"></span>
						</div>
					</div>
				</div>

				{showActions && (
					<div className="ml-2 flex flex-shrink-0 items-center space-x-2">
						{onView && (
							<button
								onClick={() => onView(attachment)}
								className="rounded-lg p-2 text-gray-400 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
								title="Xem trước"
							>
								<FaEye />
							</button>
						)}
						{onDownload && (
							<button
								onClick={() => onDownload(attachment)}
								className="rounded-lg p-2 text-gray-400 transition-all duration-200 hover:bg-green-50 hover:text-green-600"
								title="Tải xuống"
							>
								<FaDownload />
							</button>
						)}
						{onDelete && (
							<button
								onClick={() => onDelete(attachment)}
								className="rounded-lg p-2 text-gray-400 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
								title="Xóa"
							>
								<FaTrash />
							</button>
						)}
					</div>
				)}
			</div>

			{attachment.description && (
				<p className="mb-3 line-clamp-2 rounded border bg-white/50 p-2 text-sm text-gray-600">
					{attachment.description}
				</p>
			)}

			{attachment.type === 'IMAGE' && (
				<div className="mt-2">
					<img
						src={attachment.source}
						alt={attachment.description || attachment.name}
						className="h-32 w-full cursor-pointer rounded-lg border object-cover transition-opacity duration-200 hover:opacity-90"
						onClick={() => onView?.(attachment)}
					/>
				</div>
			)}

			{attachment.type === 'VIDEO' && (
				<div className="relative mt-2">
					<div className="flex h-32 w-full items-center justify-center rounded-lg border bg-gray-200">
						<FaVideo className="text-3xl text-gray-400" />
					</div>
					<button
						onClick={() => onView?.(attachment)}
						className="bg-opacity-30 hover:bg-opacity-20 absolute inset-0 flex items-center justify-center rounded-lg bg-black transition-all duration-200"
					>
						<div className="bg-opacity-90 rounded-full bg-white p-3">
							<FaEye className="text-xl text-gray-700" />
						</div>
					</button>
				</div>
			)}

			{attachment.type === 'AUDIO' && (
				<div className="mt-2">
					<div className="flex items-center space-x-3 rounded-lg border bg-white p-3">
						<button
							onClick={() => onView?.(attachment)}
							className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600"
						>
							<FaMusic />
						</button>
						<div className="flex-1">
							<div className="h-2 w-full rounded-full bg-gray-200">
								<div className="h-2 w-1/3 rounded-full bg-blue-500"></div>
							</div>
							<div className="mt-1 flex justify-between text-xs text-gray-500">
								<span>0:00</span>
								<span>3:45</span>
							</div>
						</div>
					</div>
				</div>
			)}

			{attachment.type === 'DOCUMENT' && (
				<div className="mt-2">
					<div
						className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border bg-white transition-colors hover:bg-gray-50"
						onClick={() => onView?.(attachment)}
					>
						{getFileIcon()}
						<span className="mt-2 text-sm text-gray-600">
							Nhấn để xem trước
						</span>
					</div>
				</div>
			)}

			<div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
				<span className="rounded border bg-white px-2 py-1 text-xs font-medium text-gray-600 capitalize">
					{attachment.type.toLowerCase()}
				</span>
				<span className="text-xs text-gray-500">ID: {attachment.id}</span>
			</div>
		</div>
	);
};

export default Attachment;
