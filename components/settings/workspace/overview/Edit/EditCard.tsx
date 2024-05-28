import React from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { EditWorkspaceDataForm } from './EditWorkspaceDataForm';
import { SettingsWorkspace } from '@/types/extended';
import { EditWorkspaceImage } from './EditWorkspaceImage';
import { useTranslations } from 'next-intl';

interface Props {
	workspace: SettingsWorkspace;
}

export const EditCard = ({ workspace }: Props) => {
	const t = useTranslations('EDIT_WORKSPACE');
	return (
		<Card className='bg-background border-none shadow-none '>
			<CardHeader>
				<h1 className='text-2xl font-semibold leading-none tracking-tight'>{t('TITLE')}</h1>
				<CardDescription className='text-base  break-words'>{t('DESC')}</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4 '>
				<EditWorkspaceImage workspace={workspace} />
				<EditWorkspaceDataForm workspace={workspace} />
			</CardContent>
		</Card>
	);
};
