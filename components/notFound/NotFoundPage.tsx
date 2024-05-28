'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next-intl/link';
import { LocaleSwitcher } from '../switchers/LocaleSwitcher';
import { ThemeSwitcher } from '../switchers/ThemeSwitcher';
import { useTranslations } from 'next-intl';

export const NotFoundPage = () => {
	const t = useTranslations('NOT_FOUND');
	return (
		<div className='min-h-screen w-full flex flex-col items-center p-4 '>
			<div className='flex items-center self-end gap-2 w-fit '>
				<LocaleSwitcher alignHover='end' alignDropdown='end' size={'icon'} variant={'outline'} />
				<ThemeSwitcher alignHover='end' alignDropdown='end' size={'icon'} variant={'outline'} />
			</div>
			<div className='w-full max-w-xl'>
				<Image
					className='w-full h-full object-cover'
					src={'/svg/notFound.svg'}
					alt='not found'
					width={600}
					height={600}
				/>
			</div>
			<div className='text-center space-y-2'>
				<h1 className='text-4xl md:text-6xl font-bold'>{t('TITLE')}</h1>
				<p className='text-muted-foreground md:text-lg'>
					{t('TEXT.FIRST')}{' '}
					<Link
						href={'/'}
						className='font-semibold text-primary border-b border-transparent hover:border-primary transition-colors duration-200 '>
						{t('TEXT.SECOND')}
					</Link>
				</p>
			</div>
		</div>
	);
};
