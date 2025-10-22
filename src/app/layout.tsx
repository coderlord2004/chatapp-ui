'use client';

import type { PropsWithChildren } from 'react';
import { ThemeContextProvider } from '@/hooks/useTheme';
import { NotificationProvider } from '@/hooks/useNotification';
import RouteProgress from '@/components/RouteProgress';

import '@fontsource-variable/roboto';
import '@fontsource-variable/fira-code';
import '@fortawesome/fontawesome-free/css/all.css';

import './globals.css';

function ContextProviders({ children }: PropsWithChildren) {
	return (
		<NotificationProvider>
			<ThemeContextProvider>
				<RouteProgress />
				{children}
			</ThemeContextProvider>
		</NotificationProvider>
	);
}

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body className="antialiased">
				<ContextProviders>{children}</ContextProviders>
			</body>
		</html>
	);
}
