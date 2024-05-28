import { Workspace } from '@prisma/client';
import React from 'react';
import { SelectWorkspace } from './SelectWorkspace';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Props {
	workspaces?: Workspace[];
	onSelectActiveWorkspace: (workspace: Workspace) => void;
}

export const Workspaces = ({ workspaces, onSelectActiveWorkspace }: Props) => {
	return (
		<ScrollArea className='w-full max-h-64 sm:max-h-72  bg-background/70 border border-border p-4 rounded-md shadow-sm'>
			<div className='w-full h-full flex flex-col  '>
				{workspaces &&
					workspaces.map((workspace) => (
						<SelectWorkspace
							key={workspace.id}
							workspace={workspace}
							onSelectActiveWorkspace={onSelectActiveWorkspace}
						/>
					))}
			</div>
		</ScrollArea>
	);
};
