import React from 'react';
import { IoIosSunny } from 'react-icons/io';
import { FaMoon } from 'react-icons/fa6';
import { useTheme } from '@/hooks/useTheme';

function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();

	return (
		<div>
			<label htmlFor="toggleThemeInput" className="cursor-pointer">
				{theme === 'dark' ? (
					<IoIosSunny
						className='text-[150%] text-amber-300'
					/>
				) : (
					<FaMoon
						className='text-[150%] text-white'
					/>
				)}
			</label>
			<input
				id="toggleThemeInput"
				type="checkbox"
				checked={theme === 'dark'}
				onChange={() => {
					console.log('toggle');
					toggleTheme();
				}}
				className="hidden"
			/>
		</div>
	);
}

export default ThemeToggle;
