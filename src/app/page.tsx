'use client';

import { TypeAnimation } from 'react-type-animation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import { useEffect, useState } from 'react';
import { isAuthorized } from '@/utils/jwts';
import { motion } from 'framer-motion';
import { FiArrowRight, FiMessageSquare, FiLock, FiGlobe } from 'react-icons/fi';
import UniverseCanvas from '@/components/UniverseCanvas';

const features = [
	{
		icon: <FiMessageSquare className="h-8 w-8" />,
		title: 'Chat real-time',
		desc: 'Nhắn tin tức thì với công nghệ WebSocket',
		color: 'text-blue-500',
	},
	{
		icon: <FiLock className="h-8 w-8" />,
		title: 'Bảo mật',
		desc: 'Mã hóa end-to-end cho tin nhắn',
		color: 'text-green-500',
	},
	{
		icon: <FiGlobe className="h-8 w-8" />,
		title: 'Đa nền tảng',
		desc: 'Dùng mọi lúc, mọi nơi',
		color: 'text-purple-500',
	},
];

const fadeIn = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
};

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
		<div>
			<div className="z-10 flex min-h-screen flex-col items-center justify-center p-4 transition-all duration-500 dark:bg-black/50 dark:text-white">
				<header className="flex w-full items-center justify-between gap-[5px] rounded-[10px] bg-black pr-[10px] sm:pl-[70px] dark:bg-black/80 dark:text-white">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
					>
						<Logo />
					</motion.div>

					<div className="flex items-center gap-4">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
							className="hidden items-center gap-4 sm:flex"
						>
							{isAuthorized ? (
								<div className="flex gap-[10px]">
									<Link
										href="/nextvibes"
										className="px-4 py-2 font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
									>
										Mạng xã hội
									</Link>
									<Link
										href="/nextchat"
										className="px-4 py-2 font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
									>
										Chat với bạn bè
									</Link>
								</div>
							) : (
								<Link
									href="/login"
									className="px-4 py-2 font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
								>
									Đăng nhập
								</Link>
							)}
							<Link
								href="/signup"
								className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-white shadow-md transition-all hover:from-blue-700 hover:to-blue-600 hover:shadow-lg"
							>
								Đăng ký
							</Link>
						</motion.div>

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3 }}
						>
							<ThemeToggle />
						</motion.div>
					</div>
				</header>

				<main className="mt-[20px] flex w-full max-w-6xl flex-col items-start justify-center gap-x-[10px] gap-y-[10px] md:flex-row">
					<div className="mt-[40px] ml-[10px] flex-1 space-y-6">
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
										'Lướt mạng xã hội.',
										2000,
									]}
									speed={50}
									repeat={Infinity}
								/>
							</span>
						</h2>
						<p className="text-lg text-gray-500">
							NextChat - Nền tảng trò chuyện đơn giản, bảo mật và miễn phí cho
							mọi người.
						</p>
						<div className="flex space-x-4">
							<Link
								href={isAuthorized ? '/nextchat' : '/login'}
								className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-600 hover:shadow-xl"
							>
								Bắt đầu ngay
								<FiArrowRight className="transition-transform group-hover:translate-x-1" />
							</Link>
							<a
								href="#special-feature"
								className="cursor-pointer rounded-lg border border-blue-600 px-6 py-3 text-blue-600 transition hover:bg-blue-500 hover:text-white"
							>
								Xem demo
							</a>
						</div>
					</div>

					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="flex-1"
					>
						<div className="relative">
							<div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-xl"></div>
							<img
								src="/next_chat_logo.jpg"
								alt="NextChat App"
								className="relative rounded-xl shadow-2xl ring-1 ring-gray-900/10 dark:ring-gray-100/10"
							/>
						</div>
					</motion.div>
				</main>

				<section id="features" className="py-16 sm:py-24">
					<div className="mx-auto max-w-7xl px-6">
						<motion.div
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							variants={fadeIn}
							transition={{ duration: 0.6 }}
							className="mx-auto max-w-3xl text-center"
						>
							<h2 className="text-3xl font-bold sm:text-4xl">
								Tính năng nổi bật
							</h2>
							<p className="mt-4 text-gray-600 dark:text-gray-300">
								Khám phá những tính năng ưu việt giúp <strong>NextChat</strong>{' '}
								trở thành lựa chọn hàng đầu
							</p>
						</motion.div>

						<div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
							{features.map((feature, index) => (
								<motion.div
									key={index}
									initial="hidden"
									whileInView="visible"
									viewport={{ once: true }}
									variants={fadeIn}
									transition={{ duration: 0.6, delay: index * 0.1 }}
									className="group rounded-xl bg-gray-400 p-8 shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl dark:bg-gray-800"
								>
									<div
										className={`mb-6 inline-flex rounded-lg p-3 ${feature.color} bg-opacity-10`}
									>
										{feature.icon}
									</div>
									<h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
									<p className="text-gray-800 dark:text-gray-300">
										{feature.desc}
									</p>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				<section className="py-[10px] sm:py-[20px]">
					<div className="mx-auto max-w-7xl px-6">
						<div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-12 text-center shadow-xl">
							<motion.div
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true }}
								variants={fadeIn}
								transition={{ duration: 0.6 }}
								className="mx-auto max-w-3xl"
							>
								<h2 className="text-3xl font-bold text-white sm:text-4xl">
									Sẵn sàng trải nghiệm?
								</h2>
								<p className="mt-4 text-blue-100">
									Đăng ký ngay để kết nối với bạn bè và gia đình một cách dễ
									dàng và bảo mật
								</p>
								<div className="mt-8">
									<Link
										href="/signup"
										className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-blue-600 shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl"
									>
										Đăng ký miễn phí
										<FiArrowRight className="transition-transform group-hover:translate-x-1" />
									</Link>
								</div>
							</motion.div>
						</div>
					</div>
				</section>
			</div>

			<UniverseCanvas />
		</div>
	);
}
