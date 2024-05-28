'use client';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { useNewMindMap } from '@/hooks/useNewMindMap';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

interface Props {
	workspaceId: string;
}

export const NewMindMap = ({ workspaceId }: Props) => {
	const t = useTranslations('SIDEBAR.WORKSPACE_OPTIONS');

	const { newMindMap, isLoading } = useNewMindMap(workspaceId);

	return (
		<Button
			disabled={isLoading}
			onClick={() => {
				newMindMap();
			}}
			className='justify-start items-center gap-2'
			variant={'ghost'}
			size={'sm'}>
			<Plus size={16} />
			{isLoading ? <LoadingState loadingText={t('ADD_MIND_MAP_PENDING')} /> : t('ADD_MIND_MAP')}
		</Button>
	);
};
