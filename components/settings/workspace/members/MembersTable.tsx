'use client';
import React, { useEffect, useState } from 'react';
import { SettingsWorkspace } from '@/types/extended';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MembersRow } from './Row/MembersRow';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface Props {
	workspace: SettingsWorkspace;
	workspaceId: string;
}

export const MembersTable = ({ workspace, workspaceId }: Props) => {
	const t = useTranslations('EDIT_WORKSPACE.MEMBERS.TABELE');

	const [workspacesubscribers, setWorkspacesubscribers] = useState(workspace.subscribers);

	const [currentSort, setCurrentSort] = useState<'asc' | 'desc'>('desc');
	const onSort = (order: 'asc' | 'desc') => {
		const sortedSubscribers = [...workspacesubscribers];
		sortedSubscribers.sort((a, b) => {
			const usernameA = a.user.username.toLowerCase();
			const usernameB = b.user.username.toLowerCase();

			if (order === 'asc') {
				if (usernameA < usernameB) {
					return -1;
				}
				if (usernameA > usernameB) {
					return 1;
				}
			} else if (order === 'desc') {
				if (usernameA < usernameB) {
					return 1;
				}
				if (usernameA > usernameB) {
					return -1;
				}
			}

			return 0;
		});
		setCurrentSort(order);
		setWorkspacesubscribers(sortedSubscribers);
	};

	return (
		<div className='w-full flex flex-col border rounded-sm '>
			<div className='grid grid-cols-3 grid-rows-1 gap-4 p-4 border-b items-center'>
				{currentSort === 'desc' ? (
					<Button
						className='flex gap-1 items-center w-fit'
						size={'sm'}
						variant={'ghost'}
						onClick={() => {
							onSort('asc');
						}}>
						<p className='font-semibold text-sm'>{t('USERNAME')}</p>
						<ChevronDown size={16} />
					</Button>
				) : (
					<Button
						className='flex gap-1 items-center w-fit'
						size={'sm'}
						variant={'ghost'}
						onClick={() => {
							onSort('desc');
						}}>
						<p className='font-semibold text-sm'>{t('USERNAME')}</p>
						<ChevronUp size={16} />
					</Button>
				)}

				<p className='font-semibold text-sm md:hidden'>{t('PERMISSON_SMALL')}</p>
				<p className='font-semibold text-sm hidden md:inline'>{t('PERMISSON_BIG')}</p>
			</div>
			<ul>
				{workspacesubscribers.map((subscriber) => (
					<MembersRow
						key={subscriber.user.id}
						user={subscriber.user}
						userRole={subscriber.userRole}
						workspaceId={workspaceId}
						onSetWorkspacesubscribers={setWorkspacesubscribers}
					/>
				))}
			</ul>
		</div>
	);
};

{
}
