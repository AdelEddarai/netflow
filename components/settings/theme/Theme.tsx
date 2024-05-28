'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { ThemeCard } from './ThemeCard';
import { LoadingState } from '@/components/ui/loading-state';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';

interface Themes {
	type: 'dark' | 'light' | 'system';
	title: string;
	footer: string;
}

const themes: Themes[] = [
	{ type: 'light', title: 'THEME.LIGHT_TITLE', footer: 'THEME.LIGHT_FOOTER' },
	{ type: 'dark', title: 'THEME.DARK_TITLE', footer: 'THEME.DARK_FOOTER' },
	{ type: 'system', title: 'THEME.SYSTEM_TITLE', footer: 'THEME.SYSTEM_FOOTER' },
];

export const Theme = () => {
	const [isMounted, setIsMounted] = useState(false);
	const { theme: activeTheme, setTheme } = useTheme();

	const t = useTranslations('SETTINGS');

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted)
		return (
			<div className='w-full h-full flex justify-center items-center absolute top-0 left-0'>
				<LoadingState className='w-12 h-12' />
			</div>
		);

	return (
		<Card className='bg-background border-none shadow-none'>
			<CardHeader>
				<h1 className='text-2xl font-semibold leading-none tracking-tight'>{t('THEME.TITLE')}</h1>
				<CardDescription className='text-base'>{t('THEME.DESC')}</CardDescription>
			</CardHeader>
			<CardContent className='flex flex-wrap justify-center  gap-6 '>
				{themes.map((theme) => (
					<ThemeCard
						key={theme.type}
						onTheme={setTheme}
						theme={theme.type}
						activeTheme={activeTheme}
						themeTitle={t(theme.title)}
						themeFooter={t(theme.footer)}
					/>
				))}
			</CardContent>
		</Card>
	);
};
