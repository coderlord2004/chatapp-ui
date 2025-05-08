'use client';

import React, { useState } from 'react';
import Input from '@/components/Input';
import Link from 'next/link';
import axios from 'axios';
import { post } from '@/utils/request';
import { useForm } from 'react-hook-form';
import { useNotification } from '@/hooks/useNotification';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/Spinner';

type FormData = {
	username: string;
	password: string;
	rePassword: string;
};

export default function Signup() {
	const { showNotification } = useNotification();
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormData>();
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(false);

	const handleRegister = async (formData: FormData) => {
		if (formData.password !== formData.rePassword) {
			alert('Mật khẩu nhập lại không khớp!');
			return;
		}
		setLoading(true);
		try {
			const result = await post('users/register/', {
				username: formData.username,
				password: formData.password,
			});
			showNotification({
				type: 'success',
				message: result.data || 'Đăng ký thành công!',
			});
			router.push('/login');
		} catch (error) {
			if (axios.isAxiosError(error)) {
				showNotification({
					type: 'error',
					message: error.response?.data?.message || 'Đăng nhập thất bại!',
				});
			} else {
				showNotification({
					type: 'error',
					message: 'Đăng nhập thất bại!',
				});
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-[url('/image.jpg')] bg-cover bg-center bg-no-repeat p-[10px]">
			<div className="flex h-auto w-auto flex-col items-center justify-center rounded-[10px] border-[1px] border-solid border-white bg-black/70 p-[10px] sm:flex-row">
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

				<form
					className="flex h-auto max-w-[300px] flex-col space-y-[5px] rounded-[10px] border-[1px] border-solid border-white p-[10px] shadow-[2px_2px_2px_grey] sm:w-[300px]"
					onSubmit={handleSubmit(handleRegister)}
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

					<Input
						id="confirm-password"
						type="password"
						label="password again"
						refElement={undefined}
						validation={register('rePassword', {
							required: 'Vui lòng nhập lại mật khẩu',
							validate: (value) =>
								value === watch('password') || 'Mật khẩu không khớp',
						})}
						error={errors.rePassword?.message}
					/>

					<div className="my-[5px] flex items-center justify-between px-[10px]">
						<p>Have an account?</p>
						<Link href="/login" className="text-blue-500 hover:underline">
							Log in
						</Link>
					</div>

					<button
						className="h-[30px] w-full cursor-pointer rounded-[8px] bg-blue-600 text-white"
						type="submit"
					>
						{loading ? <Spinner /> : 'Đăng kí'}
					</button>

					<div className="relative my-[10px] flex h-[1px] w-full items-center justify-center bg-slate-500">
						<p className="absolute bg-black px-[10px]">Or</p>
					</div>

					<button className="mt-[10px] flex h-[30px] w-full cursor-pointer items-center justify-center rounded-[8px] bg-red-600 p-[5px] text-white">
						<img src="/google.png" alt="" className="h-full w-auto" />
						<p className="ml-[5px]">Sign up with Google</p>
					</button>
				</form>
			</div>
		</div>
	);
}
