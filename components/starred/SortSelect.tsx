'use client';
import React from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next-intl/client';
import {
	QueryObserverResult,
	RefetchOptions,
	RefetchQueryFilters,
	useQueryClient,
} from '@tanstack/react-query';
import { StarredItem } from '@/types/saved';
import { useTranslations } from 'next-intl';

interface Props {
	sortType: string;
	refetch: <TPageData>(
		options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
	) => Promise<QueryObserverResult<StarredItem[], unknown>>;
}
export const SortSelect = ({ sortType, refetch }: Props) => {
	const t = useTranslations('STARRED');
	const router = useRouter();

	const onSelectHanlder = (type: 'asc' | 'desc') => {
		router.push(`/dashboard/starred?sort=${type}`);
		refetch();
	};
	return (
		<div>
			<Select
				defaultValue={sortType}
				onValueChange={(filed) => {
					onSelectHanlder(filed as 'asc' | 'desc');
				}}>
				<SelectTrigger className='w-full'>
					<SelectValue placeholder='Sortuj' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='asc'>{t('SORT.ASC')}</SelectItem>
					<SelectItem value='desc'>{t('SORT.DESC')}</SelectItem>
				</SelectContent>
			</Select>
			<p className='text-sm text-muted-foreground mt-1'>{t('SORT.INFO')}</p>
		</div>
	);
};
