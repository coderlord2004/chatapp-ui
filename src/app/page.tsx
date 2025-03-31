"use client"

import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import Header from '@/components/Header';

export default function Page() {

  return (
    <div className="w-full h-auto">
      <Header />
      <div className="flex mt-[60px] gap-x-[5px] w-full h-auto justify-center items-center">
        <div className="w-full h-auto rounded-[8px] z-10 relative flex justify-between mt-[2%]">
          <div className="w-[30%] h-auto rounded-[10px] bg-black/50 relative ml-[10%] ">
            <img src="https://video-public.canva.com/VAFCQz1zbhs/v/fc502b099a.gif" alt="" className="w-full h-auto transform scale-x-[-1]" />
            <div className="text-[#17D0F0] text-[120%] inline-block absolute top-[20%] left-[10px]">
              <p className="border-r-[2px] border-r-solid border-r-white w-full overflow-hidden whitespace-nowrap animate-typing-effect-16">- Chat free now!</p>
            </div>
          </div>
          <div className="w-[30%] h-auto rounded-[10px] bg-black/50 relative mr-[10%] ">
            <img src="https://video-public.canva.com/VAFCQz1zbhs/v/fc502b099a.gif" alt="" className="w-full h-auto " />
            <div className="text-[#17D0F0] text-[120%] inline-block absolute top-[20%] right-[10px]">
              <p className="border-r-[2px] border-r-solid border-r-white w-0 overflow-hidden whitespace-nowrap animate-typing-effect-9">- OK bro!</p>
            </div>
          </div>
        </div>
        <div className="fixed top-0 right-0 left-0 bottom-0 z-0 flex justify-center items-center bg-gradient-to-r from-slate-900 to-slate-700">
          <img src="./bg_image.jpg" alt="" className="w-[80%] h-auto" />
        </div>
      </div>
    </div>
  );
}
