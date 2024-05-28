'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { StarredItemsList } from '../svg/StarredItemsList';
import { useTranslations } from 'next-intl';

export const NoStarredItems = () => {
	const t = useTranslations('STARRED.NO_ITEMS');
	return (
		<Card className='bg-background border-none shadow-none flex flex-col items-center mt-12 sm:mt-16 md:mt-32 text-center overflow-hidden'>
			<CardHeader className='sm:flex-row sm:items-center sm:justify-between'>
				<div className='flex flex-col space-y-1.5'>
					<h1 className='text-2xl font-semibold leading-none tracking-tight'>{t('TITLE')}</h1>
					<CardDescription className='text-base mt-4'>{t('DESC')}</CardDescription>
				</div>
			</CardHeader>
			<CardContent className='mt-4 sm:mt-0'>
				<StarredItemsList />
			</CardContent>
		</Card>
	);
};
