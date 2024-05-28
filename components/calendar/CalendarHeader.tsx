'use client';
import React from 'react';
import dayjs from 'dayjs';
import { useFormatter, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

interface Props {
	monthIndex: number;
	onResetMonthHandler: () => void;
	onChangeMonthHandler: (change: 'next' | 'prev') => void;
}

export const CalendarHeader = ({
	monthIndex,
	onChangeMonthHandler,
	onResetMonthHandler,
}: Props) => {
	const t = useTranslations('CALENDAR.HEADER');

	const format = useFormatter();
	const dateTime = new Date(dayjs().year(), monthIndex);

	const year = format.dateTime(dateTime, {
		year: 'numeric',
	});
	const month = format.dateTime(dateTime, {
		month: 'long',
	});

	return (
		<div className='w-full flex flex-col sm:flex-row justify-between items-center'>
			<h2 className='text-xl sm:text-2xl md:text-3xl mb-4 md:mb-0 '>
				<span className='font-bold'>{month}</span> <span>{year}</span>
			</h2>
			<div>
				<Button
					onClick={() => {
						onChangeMonthHandler('prev');
					}}
					className='rounded-e-none px-2 py-1  h-8  sm:h-10 sm:px-4 sm:py-2'
					variant={'outline'}>
					{t('PREV')}
				</Button>
				<Button
					onClick={onResetMonthHandler}
					className='rounded-none px-2 py-1 h-8 sm:h-10 sm:px-4 sm:py-2'
					variant={'outline'}>
					{t('TODAY')}
				</Button>
				<Button
					onClick={() => {
						onChangeMonthHandler('next');
					}}
					className='rounded-s-none px-2 py-1 h-8 sm:h-10 sm:px-4 sm:py-2'
					variant={'outline'}>
					{t('NEXT')}
				</Button>
			</div>
		</div>
	);
};
