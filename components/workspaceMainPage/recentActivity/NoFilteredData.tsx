'use client';
import React from 'react';
import { Frown } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const NoFilteredData = () => {
	const t = useTranslations('WORKSPACE_MAIN_PAGE.RECENT_ACTIVITY');

	return (
		<div className='w-full mt-20 sm:mt-32 gap-4  flex  flex-col justify-center items-center'>
			<Frown size={100} />
			<h5 className='font-semibold text-lg sm:text-xl text-center'>{t('NO_FILTERED_DATA')}</h5>
		</div>
	);
};
