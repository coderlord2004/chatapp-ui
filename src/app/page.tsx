'use client';

import { TypeAnimation } from 'react-type-animation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import { useEffect, useState } from 'react';
import { isAuthorized } from '@/utils/jwts';

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

function useIsAuthoized() {
	const [isAuthorizedState, setIsAuthoized] = useState(false);

	useEffect(() => {
		isAuthorized().then(setIsAuthoized);
	}, []);

	return isAuthorizedState;
}

export default function Page() {
	const isAuthorized = useIsAuthoized();

	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4 transition-all duration-500 dark:bg-black dark:text-white">
			<header className="flex w-full items-center justify-between gap-[5px] rounded-[10px] pr-[10px] sm:pl-[70px] dark:bg-black/80 dark:text-white">
				<Logo />
				<div className="flex items-center justify-between space-x-4">
					<div className="flex space-x-4">
						{isAuthorized ? (
							<Link
								href="/chat"
								className="hidden px-4 py-2 font-medium text-blue-600 hover:underline sm:flex"
							>
								Bắt đầu ngay
							</Link>
						) : (
							<Link
								href="/login"
								className="hidden px-4 py-2 font-medium text-blue-600 hover:underline sm:flex"
							>
								Đăng nhập
							</Link>
						)}
						<Link
							href="/signup"
							className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
						>
							Đăng ký
						</Link>
					</div>
					<ThemeToggle />
				</div>
			</header>

			<main className="mt-8 flex w-full max-w-6xl flex-col items-center justify-center gap-x-[10px] gap-y-[10px] md:flex-row">
				<div className="ml-[10px] flex-1 space-y-6">
					<h2 className="text-4xl font-bold md:text-5xl">
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
							href={isAuthorized ? '/chat' : '/login'}
							className="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
						>
							Bắt đầu ngay
						</Link>
						<a
							href="#special-feature"
							className="cursor-pointer rounded-lg border border-blue-600 px-6 py-3 text-blue-600 transition hover:bg-blue-500 hover:text-white"
						>
							Xem demo
						</a>
					</div>
				</div>

				<div className="animate-fade-in-to-right group flex flex-1 justify-end">
					<img
						src="/bg_image.jpg"
						alt="Chat App Illustration"
						className="h-auto w-full max-w-md rounded-lg object-cover shadow-xl transition-transform duration-300 group-hover:scale-104"
					/>
				</div>
			</main>

			<section className="mt-16 mb-12 w-full max-w-4xl">
				<h3
					id="special-feature"
					className="mb-8 text-center text-2xl font-bold"
				>
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
