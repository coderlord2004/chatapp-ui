import React from 'react';

type ProgressLoadingProps = {
	percent: number;
};

export default function ProgressLoading({ percent }: ProgressLoadingProps) {
	return (
		<div className="absolute top-1/2 left-1/2 h-[50px] w-[50px] -translate-x-1/2 -translate-y-1/2 transform">
			<div
				className="absolute inset-0 rounded-full"
				style={{
					background: `conic-gradient(#4ade80 ${percent * 3.6}deg, rgba(255,255,255,0.2) 0deg)`,
				}}
			></div>
			<div className="absolute inset-1 flex items-center justify-center rounded-full bg-black/50 text-[90%] text-white">
				{percent}%
			</div>
		</div>
	);
}
