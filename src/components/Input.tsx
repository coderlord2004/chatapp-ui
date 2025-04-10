'use client';

import { Ref, useState } from 'react';

type InputProps = {
	id: string;
	type: string;
	label: string;
	refElement: Ref<HTMLInputElement> | undefined;
	validation: string;
	error: string;
};

export default function Input(props: InputProps) {
	const { id, type, label, refElement } = props;

	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="relative mt-[20px]">
			<input
				id={id}
				ref={refElement}
				type={!showPassword ? type : 'text'}
				className="h-[35px] w-full cursor-pointer rounded-[7px] border-[1px] border-solid border-white p-1 px-3 text-white outline-none"
				placeholder={`Enter ${label}:`}
				// {...validation}
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
					className="absolute top-[50%] right-[3px] h-auto w-[17px] translate-y-[-50%] transform cursor-pointer"
				/>
			)}
			{/* {error && <p className="w-full text-red-500 text-right">{error.message}</p>} */}
		</div>
	);
}
