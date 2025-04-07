import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'export',
	images: {
		unoptimized: true, // Tắt tối ưu hóa hình ảnh
	},
};

export default nextConfig;
