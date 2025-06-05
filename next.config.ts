import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'export',
	images: {
		unoptimized: true, // Tắt tối ưu hóa hình ảnh
	},
	webpack: (config) => ({
		...config,
		optimization: {
			minimize: false,
		},
	}),
};

export default nextConfig;
