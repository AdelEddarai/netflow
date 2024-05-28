import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'pl'] as const;

export default getRequestConfig(async ({ locale }) => {
	if (!locales.includes(locale as 'pl' | 'en')) notFound();

	return {
		messages: (await import(`./messages/${locale}.json`)).default,
	};
});
