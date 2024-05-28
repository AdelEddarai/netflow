import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditCard } from './overview/Edit/EditCard';
import { Layers, Users2 } from 'lucide-react';
import { SettingsWorkspace } from '@/types/extended';
import { DeleteWorkspace } from './overview/DeleteWorkspace';
import { Separator } from '@/components/ui/separator';
import { MembersCard } from './members/MembersCard';

interface Props {
	workspace: SettingsWorkspace;
	workspaceId: string;
}

export const WorkspaceTab = ({ workspace, workspaceId }: Props) => {
	return (
		<Tabs defaultValue='overview'>
			<TabsList className='mb-6'>
				<TabsTrigger className='mr-2 flex items-center gap-2' value='overview'>
					<Layers size={18} />
					Overview
				</TabsTrigger>
				<TabsTrigger className='flex items-center gap-2' value='mebmers'>
					<Users2 size={18} /> Members
				</TabsTrigger>
			</TabsList>
			<TabsContent tabIndex={-1} value='overview'>
				<EditCard workspace={workspace} />
				<div className='py-4 sm:py-6'>
					<Separator />
				</div>
				<DeleteWorkspace workspace={workspace} />
			</TabsContent>
			<TabsContent value='mebmers'>
				<MembersCard workspace={workspace}  workspaceId={workspaceId}/>
			</TabsContent>
		</Tabs>
	);
};
