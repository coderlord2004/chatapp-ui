import React from 'react';
import Input from '@/components/Input';
import Link from 'next/link';

export default function Login() {
	return (
		<div className="w-full min-h-screen flex items-center justify-center bg-[url('/image.jpg')] bg-center bg-no-repeat bg-cover p-[10px]">
			<div className="flex flex-col sm:flex-row h-auto w-auto items-center justify-center rounded-[10px] border-[1px] border-solid border-white p-[10px] bg-black/70">
				<div className="flex w-[200px] flex-col items-center">
					<Link href="/">
						<img
							src="./logo.jpeg"
							alt=""
							className="h-[70px] w-[70px] rounded-[50%]"
						/>
					</Link>
					<h1 className="w-full text-center">
						Log in connect with your friend!
					</h1>
				</div>
				<form className="h-full max-w-[300px] sm:w-[300px] rounded-[10px] border-[1px] border-solid border-white p-[10px] shadow-[2px_2px_2px_grey] flex flex-col items-center justify-center space-y-[10px]">
					<Input
						id="username"
						type="text"
						label="username"
						refElement={undefined}
						validation=""
						error=""
					/>
					<Input
						id="password"
						type="password"
						label="password"
						refElement={undefined}
						validation=""
						error=""
					/>
					<div className='w-full px-[10px] flex items-center justify-between'>
						Forgot password?
					</div>
					<div className="flex items-center justify-between w-full px-[10px]">
						<p>Don&apos;t have an account?</p>
						<Link href="/signup" className='text-blue-500 hover:underline'>Sign up</Link>
					</div>

					<button
						className="h-[30px] w-full cursor-pointer rounded-[8px] bg-blue-600"
						type="submit"
					>
						Log in
					</button>

					<div className='w-full h-[1px] bg-slate-500 flex items-center justify-center relative my-[10px]'>
						<p className='absolute px-[10px] bg-black'>Or</p>
					</div>

					<button className="h-[30px] w-full cursor-pointer rounded-[8px] bg-red-600 mt-[10px]">
						Log in with Google
					</button>
				</form>
			</div>
		</div>
	);
}
