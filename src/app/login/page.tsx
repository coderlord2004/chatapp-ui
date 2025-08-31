'use client';

import React, { useEffect, useState } from 'react';
import Input from '@/components/Input';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Spinner from '@/components/Loading/Spinner';
import { useRequest } from '@/hooks/useRequest';
import { isAuthorized } from '@/utils/jwts';
import { normalRequest } from '@/utils/request';
import BinaryMatrixLoader from '@/components/Loading/BinaryMatrixLoader';

type FormData = {
	username: string;
	password: string;
};

export default function Login() {
	const { handleError } = useRequest();
	const { login } = useAuth();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(false);

	const handleLogin = async (formData: FormData) => {
		setLoading(true);

		try {
			const { data: result } = await normalRequest.post('/users/token/', {
				username: formData.username,
				password: formData.password,
			});

			login(result.access, result.refresh);
			router.push('/chat');
		} catch (err) {
			handleError(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		async function redirectIfAuthoized() {
			if (await isAuthorized()) {
				router.push('/chat');
			}
		}

		redirectIfAuthoized();
	}, [router]);

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-[url('/image.jpg')] bg-cover bg-center bg-no-repeat p-[10px]">
			<div className="relative flex h-auto w-auto flex-col items-center justify-center rounded-[10px] border-[1px] border-solid border-white bg-black/70 p-[10px] text-white sm:flex-row">
				<div className="flex w-[200px] flex-col items-center">
					<Link href="/">
						<img
							src="./logo.jpeg"
							alt=""
							className="h-[70px] w-[70px] rounded-[50%]"
						/>
					</Link>
					<h1 className="w-full text-center">
						Log in to connect with your friend!
					</h1>
				</div>
				<form
					className="flex h-full max-w-[300px] flex-col items-center justify-center space-y-[10px] rounded-[10px] border-[1px] border-solid border-white p-[10px] shadow-[2px_2px_2px_grey] sm:w-[300px]"
					onSubmit={handleSubmit(handleLogin)}
				>
					<Input
						id="username"
						type="text"
						label="username"
						refElement={undefined}
						validation={register('username', {
							required: 'Tên đăng nhập bắt buộc',
							minLength: { value: 3, message: 'Tối thiểu 3 ký tự' },
						})}
						error={errors.username?.message}
					/>
					<Input
						id="password"
						type="password"
						label="password"
						refElement={undefined}
						validation={register('password', {
							required: 'Mật khẩu bắt buộc',
							minLength: { value: 3, message: 'Tối thiểu 3 ký tự' },
						})}
						error={errors.password?.message}
					/>
					<div className="flex w-full items-center justify-between px-[10px]">
						Forgot password?
					</div>
					<div className="flex w-full items-center justify-between px-[10px]">
						<p>Don&apos;t have an account?</p>
						<Link href="/signup" className="text-blue-500 hover:underline">
							Sign up
						</Link>
					</div>

					<button
						className="flex h-[30px] w-full cursor-pointer items-center justify-center rounded-[8px] bg-blue-600"
						disabled={loading}
						type="submit"
					>
						Đăng nhập
					</button>

					<div className="relative my-[10px] flex h-[1px] w-full items-center justify-center bg-slate-500">
						<p className="absolute bg-black px-[10px]">Or</p>
					</div>

					<button className="mt-[10px] h-[30px] w-full cursor-pointer rounded-[8px] bg-red-600">
						Log in with Google
					</button>
				</form>

				{loading && (
					<div className="absolute inset-0 flex cursor-progress rounded-[10px] bg-black/70">
						<BinaryMatrixLoader
							className="mx-auto my-auto h-[140px] w-[120px]"
							title="Đang đăng nhập..."
						/>
						<div className="overlay"></div>
					</div>
				)}
			</div>
		</div>
	);
}
