'use client';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { useNewTask } from '@/hooks/useNewTask';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

interface Props {
	workspaceId: string;
}

export const NewTask = ({ workspaceId }: Props) => {
	const t = useTranslations('SIDEBAR.WORKSPACE_OPTIONS');

	const { newTask, isLoading } = useNewTask(workspaceId);

	return (
		<Button
			disabled={isLoading}
			onClick={() => {
				newTask();
			}}
			className='justify-start items-center gap-2'
			variant={'ghost'}
			size={'sm'}>
			<Plus size={16} />
			{isLoading ? <LoadingState loadingText={t('ADD_TASK_PENDING')} /> : t('ADD_TASK')}
		</Button>
	);
};
