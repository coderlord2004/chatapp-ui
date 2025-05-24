import React, { useState } from 'react';

interface ImageProps {
    src: string;
}

export default function Image({ src }: ImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false)

    if (isError)
        return (
            <div className='border-[1px] border-solid border-red-500 rounded-[8px]'>Lỗi tải ảnh</div>
        )

    return (
        <div className='relative w-full h-full rounded-[8px] overflow-hidden'>
            {/* shimmer effect */}
            {isLoading && (
                <div className="absolute inset-0 animate-skeleton z-10" />
            )}

            {/* image */}
            <img
                src={src}
                alt=""
                onLoad={() => setIsLoading(false)}
                onError={() => setIsError(true)}
                className={`object-cover w-full h-full rounded-[8px] transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            />
        </div>
    );
}
