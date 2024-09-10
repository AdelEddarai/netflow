import type { Metadata } from 'next';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';
import { AuthProvider } from '@/providers/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import { QueryProvider } from '@/providers/QueryProvider';
import { locales } from '@/i18n';
import Script from 'next/script'


export const metadata: Metadata = {
	title: 'Netflow',
	description:
		'Boost your productivity with Netflow. Create workspaces, tasks, notes, mind maps, and communicate with other participants within your workspace.',
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
	const messages = await getMessages();

	return (
		<html lang={locale} suppressHydrationWarning>
			<head>
				<Script
					async
					src="https://www.googletagmanager.com/gtag/js?id=G-FKWE1W0LQ4"
				/>

				<Script id="google-analytics">
					{`
              window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				gtag('js', new Date());

				gtag('config', 'G-FKWE1W0LQ4');;
          `}
				</Script>
			</head>
			<body className=''>
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

