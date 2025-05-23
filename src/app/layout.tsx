import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { ThemeContextProvider } from '@/hooks/useTheme';
import { NotificationProvider } from '@/hooks/useNotification';
import { AuthProvider } from '@/contexts/AuthContext';
import { SearchUserProvider } from '@/hooks/useSearchUser';

import '@fontsource-variable/roboto';
import '@fontsource-variable/fira-code';
import '@fortawesome/fontawesome-free/css/all.css';
import RouteProgress from '@/components/RouteProgress';

import './globals.css';

export const metadata: Metadata = {
	title: 'Chatting app',
	description: 'Generated by create next app',
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body className="antialiased">
				<AuthProvider>
					<NotificationProvider>
						<ThemeContextProvider>
							<SearchUserProvider>
								<RouteProgress />
								{children}
							</SearchUserProvider>
						</ThemeContextProvider>
					</NotificationProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
