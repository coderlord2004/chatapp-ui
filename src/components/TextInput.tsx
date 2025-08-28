import React, { useEffect, useRef } from 'react';

type Props = {
	externalRef?: React.RefObject<HTMLInputElement | null>;
	name?: string;
	value?: string;
	className?: string;
	placeHolder?: string;
	focus?: boolean;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function TextInput({
	externalRef,
	name,
	value,
	className,
	placeHolder,
	focus,
	onChange,
}: Props) {
	const internalRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (focus && internalRef.current) {
			internalRef?.current.focus();
		}
	}, []);

	return (
		<div
			ref={externalRef}
			className={
				className +
				' flex flex-1 items-center rounded-lg border border-gray-600 bg-gray-700 focus-within:ring-2 focus-within:ring-indigo-500'
			}
		>
			<input
				ref={internalRef}
				type="text"
				name={name}
				value={value}
				onChange={(e) => onChange && onChange(e)}
				placeholder={placeHolder}
				className="h-full w-full rounded-lg px-4 py-2 text-gray-100 focus:border-transparent focus:outline-none"
			/>
		</div>
	);
}

export default TextInput;
