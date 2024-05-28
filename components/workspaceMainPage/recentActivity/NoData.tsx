'use client';
import React from 'react';
import { Activity } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const NoData = () => {
	const t = useTranslations('WORKSPACE_MAIN_PAGE.RECENT_ACTIVITY');

	return (
		<div className='flex flex-col gap-4 sm:gap-6 w-full mt-16 sm:mt-40 items-center  '>
			<div className='text-primary'>
				<Activity size={66} />
			</div>
			<p className='font-semibold text-lg sm:text-2xl max-w-3xl text-center'>{t('NO_DATA')}</p>
		</div>
	);
};
