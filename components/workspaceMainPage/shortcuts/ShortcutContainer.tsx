'use client';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import React from 'react';
import { ShortcutContainerBtnItem } from './ShortcutContainerBtnItem';
import { MessagesSquare, PencilRuler, Workflow } from 'lucide-react';
import { LeaveWorkspace } from './leaveWorksapce/LeaveWorkspace';
import { UserPermisson } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { ShortcutContainerLinkItem } from './ShortcutContainerLinkItem';
import { useNewTask } from '@/hooks/useNewTask';
import { useNewMindMap } from '@/hooks/useNewMindMap';
import { PermissionIndicator } from './permissionIndicator/PermissionIndicator';
import { ExtendedWorkspace } from '@/types/extended';

interface Props {
	workspace: ExtendedWorkspace;
	userRole: UserPermisson | null;
}

export const ShortcutContainer = ({ userRole, workspace }: Props) => {
	const t = useTranslations('WORKSPACE_MAIN_PAGE.SHORTCUT_CONTAINER');

	const { newTask, isLoading: isNewTaskLoading } = useNewTask(workspace.id);
	const { newMindMap, isLoading: isNewMindMapLoading } = useNewMindMap(workspace.id);

	return (
		<ScrollArea className='w-full'>
			<div className='flex w-full space-x-4 pb-4  mt-4 '>
				<PermissionIndicator userRole={userRole} worksapceName={workspace.name} />

				<ShortcutContainerLinkItem
					href={`/dashboard/workspace/${workspace.id}/chat/${workspace.conversation.id}`}
					userRole={userRole}
					Icon={MessagesSquare}
					title={t('GROUP_CHAT')}
				/>

				<ShortcutContainerBtnItem
					userRole={userRole}
					Icon={PencilRuler}
					title={t('NEW_TASK')}
					isLoading={isNewTaskLoading}
					onClick={newTask}
				/>
				<ShortcutContainerBtnItem
					userRole={userRole}
					Icon={Workflow}
					title={t('NEW_MIND_MAP')}
					isLoading={isNewMindMapLoading}
					onClick={newMindMap}
				/>
				{userRole !== 'OWNER' && <LeaveWorkspace workspace={workspace} />}
			</div>
			<ScrollBar orientation='horizontal' />
		</ScrollArea>
	);
};
