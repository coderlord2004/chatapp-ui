'use client';

import { TypeAnimation } from 'react-type-animation';
import Link from 'next/link';

const entries = [
	{
		icon: '💬',
		title: 'Chat real-time',
		desc: 'Nhắn tin tức thì với công nghệ WebSocket',
	},
	{
		icon: '🔒',
		title: 'Bảo mật',
		desc: 'Mã hóa end-to-end cho tin nhắn',
	},
	{
		icon: '🌐',
		title: 'Đa nền tảng',
		desc: 'Dùng mọi lúc, mọi nơi',
	},
];

export default function Page() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4">
			<header className="flex w-full max-w-4xl items-center justify-between">
				<div className="relative h-auto w-auto">
					<img
						src="https://video-public.canva.com/VAFCQz1zbhs/v/fc502b099a.gif"
						className="h-[70px] w-auto"
					/>
					<h1 className="absolute top-[50%] left-[80px] translate-y-[-60%] transform bg-gradient-to-r from-[#D86587] to-[#54ABF4] bg-clip-text text-2xl font-bold text-transparent">
						NextChat
					</h1>
				</div>
				<div className="flex space-x-4">
					<Link
						href="/login"
						className="px-4 py-2 font-medium text-blue-600 hover:underline"
					>
						Đăng nhập
					</Link>
					<Link
						href="/signup"
						className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
					>
						Đăng ký
					</Link>
				</div>
			</header>

			<main className="mt-8 flex w-full max-w-6xl flex-col items-center justify-center gap-8 md:flex-row">
				<div className="flex-1 space-y-6">
					<h2 className="text-4xl font-bold text-white md:text-5xl">
						Kết nối mọi lúc, <br />
						<span className="text-blue-600">
							<TypeAnimation
								sequence={[
									'Nhắn tin với bạn bè.',
									2000,
									'Trò chuyện nhóm.',
									2000,
									'Gọi video miễn phí.',
									2000,
								]}
								speed={50}
								repeat={Infinity}
							/>
						</span>
					</h2>
					<p className="text-lg text-gray-600">
						NextChat - Nền tảng chat đơn giản, bảo mật và miễn phí cho mọi
						người.
					</p>
					<div className="flex space-x-4">
						<Link
							href="/login"
							className="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
						>
							Bắt đầu ngay
						</Link>
						<button className="cursor-pointer rounded-lg border border-blue-600 px-6 py-3 text-blue-600 transition hover:bg-blue-500 hover:text-white">
							Xem demo
						</button>
					</div>
				</div>

				<div className="animate-fade-in-to-right flex flex-1 justify-center">
					<img
						src="/bg_image.jpg"
						alt="Chat App Illustration"
						className="h-auto w-full max-w-md rounded-lg shadow-xl"
					/>
				</div>
			</main>

			{/* Features Section */}
			<section className="mt-16 mb-12 w-full max-w-4xl">
				<h3 className="mb-8 text-center text-2xl font-bold">
					Tính năng nổi bật
				</h3>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					{entries.map((feature, index) => (
						<div
							key={index}
							className="rounded-xl bg-slate-500 p-6 shadow-md transition hover:shadow-lg"
						>
							<div className="mb-4 text-4xl">{feature.icon}</div>
							<h4 className="mb-2 text-lg font-bold text-amber-400">
								{feature.title}
							</h4>
							<p className="text-white">{feature.desc}</p>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
