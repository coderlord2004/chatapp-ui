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
		<div className="relative mt-[10px] w-full h-auto flex flex-col items-center justify-between cursor-pointer ">
			<div className='w-full h-full flex border-[1px] border-solid border-white rounded-[7px] p-1 px-3 text-white'>
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
						className="w-[20px] h-auto cursor-pointer transform translate-x-[5px]"
					/>
				)}
			</div>
			{error && <p className="w-full text-red-500 text-right mt-[3px]">{error}</p>}
		</div>
	);
}
