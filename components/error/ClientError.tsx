'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next-intl/client';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface Props {
	message: string;
	className?: string;
	hrefToGoOnReset?: string;
	onReftech?: () => void;
}

export const ClientError = ({ message, hrefToGoOnReset, className, onReftech }: Props) => {
	const t = useTranslations('CLIENT_ERROR');
	const router = useRouter();

	return (
		<Card
			className={cn(
				'bg-background border-none shadow-none flex flex-col items-center mt-12 sm:mt-16 md:mt-32 text-center overflow-hidden',
				className
			)}>
			<CardHeader className='sm:flex-row sm:items-center sm:justify-between'>
				<div className='flex flex-col space-y-1.5'>
					<h1 className='text-2xl font-semibold leading-none tracking-tight'>{t('TITLE')}</h1>
					<CardDescription className='text-base mt-4'>{message}</CardDescription>
				</div>
			</CardHeader>
			<CardContent className='mt-4 sm:mt-0'>
				<Button
					size={'lg'}
					className='text-white'
					onClick={() => {
						hrefToGoOnReset ? router.push(hrefToGoOnReset) : router.refresh();
						onReftech && !hrefToGoOnReset && onReftech();
					}}>
					{t('BTN')}
				</Button>
			</CardContent>
		</Card>
	);
};
