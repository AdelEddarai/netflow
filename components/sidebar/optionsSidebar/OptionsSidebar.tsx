'use client';

import React from 'react';
import { usePathname } from 'next-intl/client';
import { Settings } from './settingsOptions/Settings';
import { CreatedWorkspacesInfo } from '@/components/common/CreatedWorkspacesInfo';
import { Workspace } from '@prisma/client';
import { WorkspaceOptions } from './workspaceOptions/WorkspaceOptions';
import { PomodoroLinks } from './pomodoro/PomodoroLinks';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AssignedToMeFilter } from './assignedToMeFilter/AssignedToMeFilter';

interface Props {
	createdWorkspaces: number;
	userAdminWorkspaces: Workspace[];
	userWorkspaces: Workspace[];
}

export const OptionsSidebar = ({
	createdWorkspaces,
	userAdminWorkspaces,
	userWorkspaces,
}: Props) => {
	const pathname = usePathname();
	const urlWorkspaceId: string | undefined = pathname.split('/')[3];
	const urlAditionalId: string | undefined = pathname.split('/')[6];
	const chatId: string | undefined = pathname.split('/')[5];
	const workspaceId = urlWorkspaceId ? urlWorkspaceId : '';

	if (
		pathname === '/dashboard' ||
		pathname === '/dashboard/starred' ||
		pathname === '/dashboard/calendar' ||
		(urlAditionalId &&
			pathname === `/dashboard/workspace/${workspaceId}/tasks/task/${urlAditionalId}/edit`) ||
		(urlAditionalId &&
			pathname === `/dashboard/workspace/${workspaceId}/mind-maps/mind-map/${urlAditionalId}/edit`)
	)
		return null;

	return (
		<div className='h-full p-4 sm:py-6 border-r w-52 sm:w-64 flex flex-col justify-between gap-2'>
			<ScrollArea className='h-full'>
				{pathname.includes('/dashboard/settings') && (
					<Settings userAdminWorkspaces={userAdminWorkspaces} />
				)}
				{(pathname === `/dashboard/workspace/${workspaceId}` ||
					pathname === `/dashboard/workspace/${workspaceId}/tasks/task/${urlAditionalId}` ||
					pathname === `/dashboard/workspace/${workspaceId}/mind-maps/mind-map/${urlAditionalId}` ||
					pathname === `/dashboard/workspace/${workspaceId}/chat/${chatId}`) && (
					<WorkspaceOptions workspaceId={workspaceId} />
				)}
				{(pathname === '/dashboard/pomodoro' || pathname === '/dashboard/pomodoro/settings') && (
					<PomodoroLinks />
				)}
				{pathname === '/dashboard/assigned-to-me' && (
					<AssignedToMeFilter userWorkspaces={userWorkspaces} />
				)}
			</ScrollArea>
			<CreatedWorkspacesInfo createdNumber={createdWorkspaces} />
		</div>
	);
};
