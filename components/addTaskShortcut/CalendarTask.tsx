'use client';
import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { pl, enGB } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLocale, useTranslations } from 'next-intl';

interface Props {
	date: DateRange | undefined;
	onSelectedDate: (date: DateRange | undefined) => void;
}

export const CalendarTask = ({ date, onSelectedDate }: Props) => {
	const t = useTranslations('TASK_SHORTCUT');
	const lang = useLocale();

	const currentLocale = useMemo(() => {
		if (lang === 'pl') return pl;
		else return enGB;
	}, [lang]);

	return (
		<div className='flex items-center gap-1'>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id='date'
						size={'sm'}
						variant={'secondary'}
						className={cn('flex items-center text-xs')}>
						<CalendarIcon size={16} className='mr-2 w-4 h-4' />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, 'dd LLL y', {
										locale: currentLocale,
									})}{' '}
									-{' '}
									{format(date.to, 'dd LLL y', {
										locale: currentLocale,
									})}
								</>
							) : (
								format(date.from, 'dd LLL y', {
									locale: currentLocale,
								})
							)
						) : (
							<span>{t('DUE_DATE')}</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-auto p-0' align='center'>
					<Calendar
						initialFocus
						mode='range'
						defaultMonth={date?.from}
						selected={date}
						onSelect={onSelectedDate}
						locale={currentLocale}
						numberOfMonths={1}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
};
