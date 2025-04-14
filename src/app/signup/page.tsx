import React from 'react';
import Input from '@/components/Input';
import Link from 'next/link';

export default function Signup() {
	return (
		<div className="w-full min-h-screen flex items-center justify-center bg-[url('/image.jpg')] bg-center bg-no-repeat bg-cover p-[10px]">
			<div className="flex flex-col sm:flex-row h-auto w-auto items-center justify-center rounded-[10px] border-[1px] border-solid border-white p-[10px] bg-black/70">
				<div className="flex w-[250px] flex-col items-center p-[10px]">
					<Link href="/">
						<img
							src="./logo.jpeg"
							alt=""
							className="h-[70px] w-[70px] rounded-[50%]"
						/>
					</Link>
					<h1 className="w-full text-center">
						Sign up to connect with your friend!
					</h1>
				</div>
				<form className="flex flex-col space-y-[5px] h-auto max-w-[300px] sm:w-[300px] rounded-[10px] border-[1px] border-solid border-white p-[10px] shadow-[2px_2px_2px_grey]">
					<Input
						id="username"
						type="text"
						label="username"
						refElement={undefined}
						validation=""
						error=""
					/>

					<Input
						id="email"
						type="text"
						label="email"
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

					<Input
						id="confirm-password"
						type="password"
						label="password again"
						refElement={undefined}
						validation=""
						error=""
					/>

					<div className="flex items-center justify-between px-[10px] my-[5px]">
						<p>Have an account?</p>
						<Link href="/login" className='text-blue-500 hover:underline'>Log in</Link>
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

					<button className="h-[30px] w-full p-[5px] cursor-pointer rounded-[8px] bg-red-600 mt-[10px] flex items-center justify-center">
						<img src="/google.png" alt="" className="w-auto h-full" />
						<p className="ml-[5px]">Sign up with Google</p>
					</button>
				</form>
			</div>
		</div>
	);
}
