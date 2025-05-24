import React, { useState } from 'react';

interface ImageProps {
	src: string;
}

export default function Image({ src }: ImageProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);

	if (isError)
		return (
			<div className="rounded-[8px] border-[1px] border-solid border-red-500">
				Lỗi tải ảnh
			</div>
		);

	return (
		<div className="relative h-full w-full overflow-hidden rounded-[8px]">
			{/* shimmer effect */}
			{isLoading && <div className="animate-skeleton absolute inset-0 z-10" />}

			{/* image */}
			<img
				src={src}
				alt=""
				onLoad={() => setIsLoading(false)}
				onError={() => setIsError(true)}
				className={`h-full w-full rounded-[8px] object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
			/>
		</div>
	);
}
