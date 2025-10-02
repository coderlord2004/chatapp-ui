import type { NextConfig } from 'next';
import TerserPlugin from 'terser-webpack-plugin';

const nextConfig: NextConfig = {
	images: {
		unoptimized: true,
	},
	webpack: (config) => {
		config.optimization.minimizer = [
			new TerserPlugin({
				exclude: 'src/components/VideoCall.tsx',
			}),
		];

		return config;
	},
};

export default nextConfig;
