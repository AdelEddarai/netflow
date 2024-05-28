'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { MAX_USER_WORKSPACES } from '@/lib/options';
import { useTranslations } from 'next-intl';

interface Props {
	className?: string;
	createdNumber: number;
}

export const CreatedWorkspacesInfo = ({ className, createdNumber }: Props) => {
	const t = useTranslations('COMMON');
	return (
		<p className={cn('text-muted-foreground text-xs sm:text-sm text-center', className)}>
			{t('ACTIVE_WORKSACPES.FIRST')}{' '}
			<span className='font-bold'>
				{createdNumber} {t('ACTIVE_WORKSACPES.SECOND')} {MAX_USER_WORKSPACES}
			</span>{' '}
			{t('ACTIVE_WORKSACPES.THIRD')}
		</p>
	);
};
