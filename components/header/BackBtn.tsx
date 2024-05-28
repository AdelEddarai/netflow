'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next-intl/client';
import { ChevronLeftIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const BackBtn = () => {
	const router = useRouter();
	const t = useTranslations('COMMON');

	return (
		<Button
			onClick={() => {
				router.back();
				router.refresh();
			}}
			className='gap-1 felx justify-center items-center'
			variant={'secondary'}
			size={'sm'}>
			<ChevronLeftIcon />
			<span className='hidden sm:inline-block'>{t('BACK_BTN')}</span>
		</Button>
	);
};
