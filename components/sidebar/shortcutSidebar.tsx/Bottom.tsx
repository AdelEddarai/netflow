'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Settings2, LogOutIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import ActiveLink from '@/components/ui/active-link';

export const Bottom = () => {
	const t = useTranslations('SIDEBAR');
	const lang = useLocale();
	const logOutHandler = () => {
		signOut({
			callbackUrl: `${window.location.origin}/${lang}`,
		});
	};

	return (
		<div className='flex flex-col gap-3'>
			<HoverCard openDelay={250} closeDelay={250}>
				<HoverCardTrigger tabIndex={-1}>
					<Button onClick={logOutHandler} variant={'ghost'} size={'icon'}>
						<LogOutIcon />
					</Button>
				</HoverCardTrigger>
				<HoverCardContent align='start'>
					<span>{t('MAIN.LOG_OUT_HOVER')}</span>
				</HoverCardContent>
			</HoverCard>

			<HoverCard openDelay={250} closeDelay={250}>
				<HoverCardTrigger asChild>
					<ActiveLink
						include='settings'
						variant={'ghost'}
						size={'icon'}
						href={`/dashboard/settings`}>
						<Settings2 />
					</ActiveLink>
				</HoverCardTrigger>
				<HoverCardContent align='start'>
					<span>{t('MAIN.SETTINGS_HOVER')}</span>
				</HoverCardContent>
			</HoverCard>
		</div>
	);
};
