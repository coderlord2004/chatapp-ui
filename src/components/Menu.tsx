import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type MenuDataType = {
	title: string;
	accepted?: boolean;
	icon?: React.ReactElement;
	action: (index: number) => void;
};

type Props = {
	children: ReactNode;
	data: MenuDataType[];
	position?: 'top' | 'left' | 'right' | 'bottom';
	className?: string;
};

export default function Menu({
	children,
	data,
	position = 'bottom',
	className = 'w-full h-full relative',
}: Props) {
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const getPositionClasses = () => {
		switch (position) {
			case 'top':
				return 'bottom-full left-0 mb-2 origin-bottom';
			case 'left':
				return 'right-full top-0 mr-2 origin-right';
			case 'right':
				return 'left-full top-0 ml-2 origin-left';
			case 'bottom':
			default:
				return 'top-full left-0 mt-2 origin-top';
		}
	};

	const getArrowPosition = () => {
		switch (position) {
			case 'top':
				return 'bottom-[-10px] left-3 border-t-slate-700 border-x-transparent border-b-0';
			case 'left':
				return 'right-[-10px] top-2.5 border-l-slate-700 border-y-transparent border-r-0';
			case 'right':
				return 'left-[-10px] top-2.5 border-r-slate-700 border-y-transparent border-l-0';
			case 'bottom':
				return 'top-[-10px] left-3 border-b-slate-700 border-x-transparent border-t-0';
			default:
				return 'top-[-10px] left-3 border-b-slate-700 border-x-transparent border-t-0';
		}
	};

	const toggleMenu = () => setOpen((prev) => !prev);

	const handleClick = (action: (index: number) => void, index: number) => {
		action(index);
		setOpen(false);
	};

	const menuVariants = {
		hidden: {
			opacity: 0,
			scale: 0.8,
			transition: { duration: 0.1 },
		},
		visible: {
			opacity: 1,
			scale: 1,
			transition: { duration: 0.2 },
		},
	};

	return (
		<div className={className} ref={menuRef}>
			<div
				onClick={toggleMenu}
				className="h-full w-full cursor-pointer select-none"
			>
				{children}
			</div>

			<AnimatePresence>
				{open && (
					<>
						<motion.div
							initial="hidden"
							animate="visible"
							exit="hidden"
							variants={menuVariants}
							className={`absolute ${getPositionClasses()} z-50 flex min-w-[200px] flex-col rounded-lg border border-gray-200 bg-slate-700 text-white shadow-lg`}
						>
							{data.map(
								(ele, index) =>
									(ele.accepted ?? true) && (
										<div
											key={index}
											onClick={() => handleClick(ele.action, index)}
											className="flex cursor-pointer items-center justify-center gap-[10px] rounded-lg px-4 py-2 text-left text-sm first:rounded-t-lg last:rounded-b-lg hover:bg-blue-600"
										>
											<p>{ele.title}</p>
											<div className="text-[130%]">{ele.icon}</div>
										</div>
									),
							)}
							<div
								className={`absolute ${getArrowPosition()} z-50 border-[10px] border-solid`}
							/>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
