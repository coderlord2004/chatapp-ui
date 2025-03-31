import React from 'react';
import Input from '@/components/Input';
import Link from 'next/link';

type loginProps = {};

export default function Login({}: loginProps) {
	return (
		<div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black/30">
			<div className="flex h-[60%] w-[55%] items-center justify-center rounded-[10px] border-[1px] border-solid border-white p-[10px]">
				<div className="flex w-[45%] flex-col items-center">
					<img
						src="./logo.jpeg"
						alt=""
						className="h-[70px] w-[70px] rounded-[50%]"
					/>
					<h1 className="w-full text-center">
						Log in connect with your friend!
					</h1>
				</div>
				<form className="h-full w-[55%] rounded-[10px] border-[1px] border-solid border-white p-[10px] shadow-[2px_2px_2px_grey]">
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
					<div className="flex items-center justify-between px-[10px]">
						<p>Don't have an account?</p>
						<Link href="/signup">Sign up</Link>
					</div>
					<button
						className="mt-[10px] h-[30px] w-full cursor-pointer rounded-[8px] bg-blue-600"
						type="submit"
					>
						Log in
					</button>
				</form>
			</div>
		</div>
	);
}
