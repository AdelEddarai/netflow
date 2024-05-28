'use client';
import React from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { CommandContainer } from './FilterCommand/CommandContainer';
import { FilterIcon } from 'lucide-react';
import { LoadingState } from '@/components/ui/loading-state';
import { ClientError } from '@/components/error/ClientError';
import { useFilterByUsersAndTagsInWorkspace } from '@/context/FilterByUsersAndTagsInWorkspace';
import { useTranslations } from 'next-intl';

interface Props {
	sessionUserId: string;
}

export const Filter = ({ sessionUserId }: Props) => {
	const t = useTranslations('WORKSPACE_MAIN_PAGE.FILTER');
	const { isError, isLoding } = useFilterByUsersAndTagsInWorkspace();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size={'sm'} className='text-white flex gap-2 items-center rounded-lg'>
					<FilterIcon size={16} /> {t('FILTER_BTN')}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-fit' align='start'>
				{isLoding ? (
					<div className='h-16 flex items-center justify-center'>
						<LoadingState size={22} />
					</div>
				) : isError ? (
					<ClientError
						className='bg-popover mt-0 sm:mt-0 md:mt-0'
						message='nie udało sie załadować danych filtracji'
					/>
				) : (
					<CommandContainer sessionUserId={sessionUserId} />
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
