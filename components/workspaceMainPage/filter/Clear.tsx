'use client';
import { Button } from '@/components/ui/button';
import { useFilterByUsersAndTagsInWorkspace } from '@/context/FilterByUsersAndTagsInWorkspace';
import { Eraser } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

export const Clear = () => {
	const t = useTranslations('WORKSPACE_MAIN_PAGE.FILTER');
	const { onClearAll } = useFilterByUsersAndTagsInWorkspace();

	return (
		<Button
			onClick={onClearAll}
			size={'sm'}
			variant={'secondary'}
			className=' flex gap-2 items-center rounded-lg'>
			<Eraser size={16} /> {t('CLEAR_BTN')}
		</Button>
	);
};
