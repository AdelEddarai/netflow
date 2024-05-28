import React from 'react';
import { Bottom } from './Bottom';
import { Top } from './Top';
import { Workspaces } from './workspaces/Workspaces';
import { AddWorkspace } from './newWorkspace/AddWorkspace';
import { Workspace } from '@prisma/client';
import { ScrollArea } from '@/components/ui/scroll-area';
interface Props {
	userWorkspaces: Workspace[];
	createdWorkspaces: number;
}

export const ShortcutSidebar = ({ userWorkspaces, createdWorkspaces }: Props) => {
	return (
		<div className='flex flex-col justify-between items-center h-full p-4 sm:py-6 border-r gap-2'>
			<ScrollArea className='max-h-[35rem]'>
				<div className='w-full space-y-3 p-1 '>
					<Top />
					<Workspaces userWorkspaces={userWorkspaces} href='/dashboard/workspace' />
					<AddWorkspace createdWorkspaces={createdWorkspaces} />
				</div>
			</ScrollArea>
			<Bottom />
		</div>
	);
};
