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
						style={{
							fontSize: '150%',
						}}
					/>
				) : (
					<FaMoon
						style={{
							fontSize: '150%',
						}}
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
