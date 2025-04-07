'use client';

import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import Header from '@/components/Header';

export default function Page() {
	return (
		<div className="h-auto w-full">
			<Header />
			<div className="mt-[60px] flex h-auto w-full items-center justify-center gap-x-[5px]">
				<div className="relative z-10 mt-[2%] flex h-auto w-full justify-between rounded-[8px]">
					<div className="relative ml-[10%] h-auto w-[30%] rounded-[10px] bg-black/50">
						<img
							src="https://video-public.canva.com/VAFCQz1zbhs/v/fc502b099a.gif"
							alt=""
							className="h-auto w-full scale-x-[-1] transform"
						/>
						<div className="absolute top-[20%] left-[10px] inline-block text-[120%] text-[#17D0F0]">
							<p className="border-r-solid animate-typing-effect-16 w-full overflow-hidden border-r-[2px] border-r-white whitespace-nowrap">
								- Chat free now!
							</p>
						</div>
					</div>
					<div className="relative mr-[10%] h-auto w-[30%] rounded-[10px] bg-black/50">
						<img
							src="https://video-public.canva.com/VAFCQz1zbhs/v/fc502b099a.gif"
							alt=""
							className="h-auto w-full"
						/>
						<div className="absolute top-[20%] right-[10px] inline-block text-[120%] text-[#17D0F0]">
							<p className="border-r-solid animate-typing-effect-9 w-0 overflow-hidden border-r-[2px] border-r-white whitespace-nowrap">
								- OK bro!
							</p>
						</div>
					</div>
				</div>
				<div className="fixed top-0 right-0 bottom-0 left-0 z-0 flex items-center justify-center bg-gradient-to-r from-slate-900 to-slate-700">
					<img src="./bg_image.jpg" alt="" className="h-auto w-[80%]" />
				</div>
			</div>
		</div>
	);
}
