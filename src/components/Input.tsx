'use client';

import { Ref, useState } from 'react';

type InputProps = {
	id: string;
	type: string;
	label: string;
	refElement: Ref<HTMLInputElement> | undefined;
	validation: object;
	error: undefined | string;
};

export default function Input(props: InputProps) {
	const { id, type, label, validation, refElement, error } = props;

	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="relative mt-[10px] flex h-auto w-full cursor-pointer flex-col items-center justify-between">
			<div className="flex h-full w-full rounded-[7px] border-[1px] border-solid border-white p-1 px-3 text-white">
				<input
					id={id}
					ref={refElement}
					type={!showPassword ? type : 'text'}
					className="w-[90%] outline-none"
					placeholder={`Enter ${label}:`}
					{...validation}
					required
				/>
				{type === 'password' && (
					<img
						src={
							showPassword
								? 'https://img.icons8.com/ultraviolet/40/blind.png'
								: 'https://img.icons8.com/ultraviolet/40/visible.png'
						}
						alt={showPassword ? 'hide' : 'visible'}
						onClick={() => setShowPassword(!showPassword)}
						className="h-auto w-[20px] translate-x-[5px] transform cursor-pointer"
					/>
				)}
			</div>
			{error && (
				<p className="mt-[3px] w-full text-right text-red-500">{error}</p>
			)}
		</div>
	);
}
