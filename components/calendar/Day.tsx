'use client';
import React, { useEffect, useState } from 'react';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import { CalendarItem } from '@/types/extended';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { CalendarTasks } from './CalendarTasks';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface Props {
	day: Dayjs;
	monthIndex: number;
	calendarItems: CalendarItem[];
}

export const Day = ({ day, monthIndex, calendarItems }: Props) => {
	const isPreviousMonth = day.month() !== monthIndex;
	const [tasks, setTasks] = useState<CalendarItem[]>([]);

	useEffect(() => {
		const filterTasks = calendarItems.filter((dayInfo, i) => {
			const startDate = dayjs(dayInfo.taskDate?.from);
			const endDate = dayInfo.taskDate?.to ? dayjs(dayInfo.taskDate?.to) : null;

			if (startDate.isSame(day) && !endDate) return dayInfo;
			else if (day.isSameOrAfter(startDate) && day.isSameOrBefore(endDate)) {
				return dayInfo;
			}
		});

		setTasks(filterTasks);
	}, [day, calendarItems]);

	return (
		<div
			className={cn(
				`border border-border flex flex-col  transition-opacity duration-200 bg-background py-1 px-1.5  ${
					day.format('ddd') === 'Sat' || day.format('ddd') === 'Sun'
						? ' bg-accent dark:bg-popover/50 '
						: ''
				}  ${isPreviousMonth ? 'opacity-50 dark:opacity-25 ' : ''}`
			)}>
			<div className='flex flex-col   items-end mb-2'>
				<p
					className={`text-sm p-1 mt-1 text-center ${
						day.format('DD-MM-YY') === dayjs().format('DD-MM-YY')
							? 'transition-colors duration-200 bg-primary text-white w-7 rounded-full'
							: ''
					}`}>
					{day.format('DD')}
				</p>
			</div>

			<CalendarTasks calendarItems={tasks} />
		</div>
	);
};
