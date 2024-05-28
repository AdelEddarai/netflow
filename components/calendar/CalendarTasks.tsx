'use client';
import React, { useMemo } from 'react';
import { CalendarItem } from '@/types/extended';
import { CalendarTask } from './CalendarTask';
import { ShowMore } from './ShowMore';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useMediaQuery } from '@react-hook/media-query';

interface Props {
	calendarItems: CalendarItem[];
}

export const CalendarTasks = ({ calendarItems }: Props) => {
	const isSmallScreen = useMediaQuery('(max-width: 640px)');

	const visibleItems = useMemo(() => {
		return calendarItems.slice(0, 2);
	}, [calendarItems]);

	if (isSmallScreen)
		return (
			<div className='relative flex flex-col  items-center justify-center  py-1  h-full overflow-y-clip  '>
				{calendarItems.length >= 1 && (
					<ShowMore small leftItemsAmmount={calendarItems.length} calendarItems={calendarItems} />
				)}
			</div>
		);
	else
		return (
			<ScrollArea className='w-full h-full'>
				<div className='relative flex flex-col gap-1.5 py-1  h-full overflow-y-clip  '>
					{visibleItems.map((calendarItem) => (
						<CalendarTask key={calendarItem.taskId} dayInfo={calendarItem} />
					))}
					{calendarItems.length > 3 && (
						<ShowMore
							leftItemsAmmount={calendarItems.length - visibleItems.length}
							calendarItems={calendarItems}
						/>
					)}
				</div>
				<ScrollBar orientation='horizontal' />
			</ScrollArea>
		);
};
