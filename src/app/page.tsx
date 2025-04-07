"use client";

import Header from '@/components/Header';
import React from 'react';
import Image from 'next/image';
import { TypeAnimation } from 'react-type-animation';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <header className="w-full max-w-4xl flex justify-between items-center">
        <div className="w-auto h-auto relative">
          <img src="https://video-public.canva.com/VAFCQz1zbhs/v/fc502b099a.gif" alt="" className='w-auto h-[70px]' />
          <h1 className="text-2xl font-bold absolute top-[50%] left-[80px] transform translate-y-[-60%] bg-gradient-to-r from-[#D86587] to-[#54ABF4] text-transparent bg-clip-text">
            NextChat
          </h1>
        </div>
        <div className="flex space-x-4">
          <Link href="/login" className="px-4 py-2 text-blue-600 font-medium hover:underline">
            Đăng nhập
          </Link>
          <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Đăng ký
          </Link>
        </div>
      </header>

      <main className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mt-8 gap-8">

        <div className="flex-1 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
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
          <p className="text-gray-600 text-lg">
            NextChat - Nền tảng chat đơn giản, bảo mật và miễn phí cho mọi người.
          </p>
          <div className="flex space-x-4">
            <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Bắt đầu ngay
            </Link>
            <button className="globalButtonStyle px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-500 hover:text-white transition">
              Xem demo
            </button>
          </div>
        </div>

        <div className="flex-1 flex justify-center animate-fade-in-to-right">
          <img
            src="/bg_image.jpg"
            alt="Chat App Illustration"
            className="w-full h-auto max-w-md rounded-lg shadow-xl"
          />
        </div>
      </main>

      {/* Features Section */}
      <section className="w-full max-w-4xl mt-16 mb-12">
        <h3 className="text-2xl font-bold text-center mb-8">Tính năng nổi bật</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
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
          ].map((feature, index) => (
            <div key={index} className="bg-slate-500 p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h4 className="font-bold text-lg text-amber-400 mb-2">{feature.title}</h4>
              <p className="text-white">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}