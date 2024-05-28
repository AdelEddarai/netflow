'use client';

import ActiveLink from '@/components/ui/active-link';
import { Clock, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

export const PomodoroLinks = () => {
	const t = useTranslations('SIDEBAR.POMODORO');
	return (
		<div className='flex flex-col gap-6 w-full'>
			<div className='flex flex-col gap-2 w-full mt-2'>
				<ActiveLink
					href='/dashboard/pomodoro'
					variant={'ghost'}
					size={'sm'}
					className='w-full flex justify-start items-center gap-2 '>
					<Clock />
					{t('TIMER')}
				</ActiveLink>

				<ActiveLink
					href='/dashboard/pomodoro/settings'
					variant={'ghost'}
					size={'sm'}
					className='w-full flex justify-start items-center gap-2 '>
					<Settings />
					{t('SETTINGS')}
				</ActiveLink>
			</div>
		</div>
	);
};
