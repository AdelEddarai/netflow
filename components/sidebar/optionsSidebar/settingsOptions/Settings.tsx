'use client';
import React from 'react';

import ActiveLink from '@/components/ui/active-link';
import { User2, SunMoon, LockKeyhole } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Workspace } from '@prisma/client';
import { SettingsWorkspace } from './SettingsWorkspace';

interface Props {
	userAdminWorkspaces: Workspace[];
}

const settingsFields = [
	{
		href: '/dashboard/settings',
		icon: <User2 size={20} />,
		title: 'SETTINGS.ACCOUNT',
	},
	{
		href: '/dashboard/settings/security',
		icon: <LockKeyhole size={20} />,
		title: 'SETTINGS.SECURITY',
	},
	{
		href: '/dashboard/settings/theme',
		icon: <SunMoon size={20} />,
		title: 'SETTINGS.THEME',
	},
];

export const Settings = ({ userAdminWorkspaces }: Props) => {
	const t = useTranslations('SIDEBAR');
	return (
		<div className='flex flex-col gap-6 w-full'>
			<div>
				<p className='text-xs sm:text-sm uppercase text-muted-foreground '>
					{t('SETTINGS.GENERAL')}
				</p>
				<div className='flex flex-col gap-2 w-full mt-2'>
					{settingsFields.map((settingFiled, i) => (
						<ActiveLink
							key={i}
							href={settingFiled.href}
							variant={'ghost'}
							size={'sm'}
							className='w-full flex justify-start items-center gap-2 '>
							{settingFiled.icon}
							{t(settingFiled.title)}
						</ActiveLink>
					))}
				</div>
			</div>

			<div>
				<p className='text-xs sm:text-sm uppercase text-muted-foreground '>
					{t('SETTINGS.WORKSPACE')}
				</p>
				<div className='flex flex-col gap-2 w-full mt-2 '>
					{userAdminWorkspaces.map((workspace) => (
						<SettingsWorkspace
							key={workspace.id}
							href='/dashboard/settings/workspace'
							workspace={workspace}
						/>
					))}
				</div>
			</div>
		</div>
	);
};
