'use client';

import React from 'react';
import { PencilRuler, Workflow } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { WorkspaceOption } from './WorkspaceOption';
import { useQuery } from '@tanstack/react-query';
import { WorkspaceShortcuts } from '@/types/extended';
import { LoadingState } from '@/components/ui/loading-state';
import { NewTask } from './actions/NewTask';
import { NewMindMap } from './actions/NewMindMap';
import { UsersContainer } from './usersList/UsersContainer';

interface Props {
	workspaceId: string;
}

export const WorkspaceOptions = ({ workspaceId }: Props) => {
	const t = useTranslations('SIDEBAR.WORKSPACE_OPTIONS');

	const { data: workspaceShortcuts, isLoading } = useQuery({
		queryFn: async () => {
			const res = await fetch(`/api/workspace/get/workspace_shortcuts?workspaceId=${workspaceId}`);

			if (!res.ok) return null;

			const data = await res.json();
			return data as WorkspaceShortcuts;
		},

		queryKey: ['getWorkspaceShortcuts', workspaceId],
	});

	return (
		<div className='w-full flex flex-col gap-6 '>
			<div>
				<p className='text-xs sm:text-sm uppercase text-muted-foreground '>{t('SHORTCUTS')}</p>
				{!isLoading && workspaceShortcuts && (
					<div className='flex flex-col gap-2 w-full mt-2'>
						<WorkspaceOption
							defaultName={t('DEFAULT_NAME')}
							workspaceId={workspaceId}
							href={`tasks/task`}
							fields={workspaceShortcuts.tasks}>
							<PencilRuler size={16} />
							{t('TASKS')}
						</WorkspaceOption>
						<WorkspaceOption
							defaultName={t('DEFAULT_NAME')}
							workspaceId={workspaceId}
							href={`mind-maps/mind-map`}
							fields={workspaceShortcuts.mindMaps}>
							<Workflow size={16} />
							{t('MIND_MAPS')}
						</WorkspaceOption>
					</div>
				)}
				{isLoading && (
					<div className='flex justify-center items-center w-full mt-2 h-28'>
						<LoadingState />
					</div>
				)}
			</div>
			<div>
				<p className='text-xs sm:text-sm uppercase text-muted-foreground '>{t('ACTIONS')}</p>
				<div className='flex flex-col gap-2 w-full mt-2 '>
					<NewTask workspaceId={workspaceId} />
					<NewMindMap workspaceId={workspaceId} />
				</div>
			</div>
			<UsersContainer />
		</div>
	);
};
