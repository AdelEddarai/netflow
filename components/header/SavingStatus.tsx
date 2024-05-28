'use client';
import React from 'react';
import { useAutosaveIndicator } from '@/context/AutosaveIndicator';
import { FileWarning, Save } from 'lucide-react';
import { LoadingState } from '@/components/ui/loading-state';
import { cn } from '@/lib/utils';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useTranslations } from 'next-intl';

export const SavingStatus = () => {
	const t = useTranslations('COMMON.SAVING_STATUS');

	const { status } = useAutosaveIndicator();

	return (
		<HoverCard openDelay={250} closeDelay={250}>
			<HoverCardTrigger asChild>
				<div
					className={cn(
						`px-3 h-9 py-1.5 flex justify-center items-center rounded-md  font-semibold gap-2 text-sm bg-primary text-white ${
							status === 'pending' ? 'bg-yellow-400' : ''
						} ${status === 'unsaved' ? 'bg-red-500' : ''}`
					)}>
					{status === 'saved' && (
						<>
							<Save size={18} />
							<p className='hidden sm:inline-block'>{t('SAVED')}</p>
						</>
					)}
					{status === 'pending' && (
						<>
							<LoadingState />
							<p className='hidden sm:inline-block'>{t('SAVING')}</p>
						</>
					)}
					{status === 'unsaved' && (
						<>
							<FileWarning size={18} />
							<p className='hidden sm:inline-block'>{t('UNSAVED')}</p>
						</>
					)}
				</div>
			</HoverCardTrigger>
			<HoverCardContent align='start'>Zapisujemy Twoje pliki automatycznie </HoverCardContent>
		</HoverCard>
	);
};
