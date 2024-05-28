import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';
import { AuthProvider } from '@/providers/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import { QueryProvider } from '@/providers/QueryProvider';
import { locales } from '@/i18n';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'StudyFlow',
	description:
		'Boost your productivity with StudyFlow. Create workspaces, tasks, notes, mind maps, and communicate with other participants within your workspace.',
};

const RootLayout = async ({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) => {
	const isValidLocale = locales.some((cur) => cur === locale);
	if (!isValidLocale) notFound();
	const messages = await getMessages(locale);

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={inter.className}>
				<NextIntlClientProvider locale={locale} messages={messages}>
					<AuthProvider>
						<QueryProvider>
							<ThemeProvider
								attribute='class'
								defaultTheme='system'
								enableSystem
								disableTransitionOnChange>
								<Toaster />
								{children}
							</ThemeProvider>
						</QueryProvider>
					</AuthProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
};

export default RootLayout;
