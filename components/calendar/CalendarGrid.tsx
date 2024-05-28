'use client';
import React, { Fragment } from 'react';
import { Day } from './Day';
import dayjs from 'dayjs';
import { CalendarItem } from '@/types/extended';
import { useTranslations } from 'next-intl';

interface Props {
	currMonth: dayjs.Dayjs[][];
	monthIndex: number;
	calendarItems: CalendarItem[];
}

const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const CalendarGrid = ({ currMonth, monthIndex, calendarItems }: Props) => {
	const t = useTranslations('CALENDAR.DAYS_OF_WEEK');

	return (
		<>
			<div className='w-full h-full flex flex-col gap-3 '>
				<div className='w-full grid grid-cols-7 text-right '>
					{daysOfWeek.map((day, index) => (
						<p key={index} className='mr-2 font-semibold text-sm'>
							{t(day)}
						</p>
					))}
				</div>
				<div className='h-full w-full grid grid-cols-7 grid-rows-5'>
					{currMonth.map((row, i) => (
						<Fragment key={i}>
							{row.map((day, idx) => (
								<Day key={idx} day={day} monthIndex={monthIndex} calendarItems={calendarItems} />
							))}
						</Fragment>
					))}
				</div>
			</div>
		</>
	);
};
