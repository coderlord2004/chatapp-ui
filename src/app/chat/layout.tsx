'use client';

import { ChangeEvent, PropsWithChildren, useState } from 'react';
import WebSocketContextProvider from '@/contexts/WebSocketContextProvider';

export default function Layout({ children }: PropsWithChildren) {
	const [token, setToken] = useState<string>('');

	function onChange(e: ChangeEvent<HTMLInputElement>) {
		setToken(e.target.value);
	}

	return (
		<>
			<input type="text" onChange={onChange} className="bg-white text-black" />
			{token.length > 0 ? (
				<WebSocketContextProvider token={token}>
					{children}
				</WebSocketContextProvider>
			) : (
				children
			)}
		</>
	);
}
