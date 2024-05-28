'use client';
import React, { useMemo } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useLocale, useTranslations } from 'next-intl';
import { pl, enGB } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface Props {
	from?: Date;
	to?: Date;
}

export const ReadOnlyCallendar = ({ from, to }: Props) => {
	const lang = useLocale();

	const t = useTranslations('TASK.EDITOR.READ_ONLY');

	const currentLocale = useMemo(() => {
		if (lang === 'pl') return pl;
		else return enGB;
	}, [lang]);

	return (
		<Badge className='px-2.5 py-0.5  h-fit  text-xs bg-background' variant={'outline'}>
			<CalendarIcon size={16} className='mr-2 w-3 h-3' />

			{from ? (
				to ? (
					<>
						{format(new Date(from), 'dd LLL y', {
							locale: currentLocale,
						})}{' '}
						-{' '}
						{format(new Date(to), 'dd LLL y', {
							locale: currentLocale,
						})}
					</>
				) : (
					format(new Date(from), 'dd LLL y', {
						locale: currentLocale,
					})
				)
			) : (
				<span>{t('NO_DATE')}</span>
			)}
		</Badge>
	);
};
