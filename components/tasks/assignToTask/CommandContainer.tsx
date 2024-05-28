'use client';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandList,
} from '@/components/ui/command';
import { AssignedToTaskUser } from '@/types/extended';
import { CommandUser } from './CommandUser';
import { useTranslations } from 'next-intl';

interface Props {
	users: AssignedToTaskUser[];
	taskId: string;
	workspaceId: string;
	canEdit: boolean;
}

export const CommandContainer = ({ users, taskId, workspaceId, canEdit }: Props) => {
	const t = useTranslations('TASK.ASSIGNMENT');

	return (
		<Command className='w-[15rem]'>
			<CommandInput className='text-xs' placeholder={t('PLACEHOLDER')} />
			<CommandList>
				<CommandEmpty>{t('NOT_FOUND')}</CommandEmpty>
				<CommandGroup heading={t('HEADING')}>
					{users.map((user) => (
						<CommandUser
							key={user.user.id}
							user={user}
							taskId={taskId}
							workspaceId={workspaceId}
							canEdit={canEdit}
						/>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	);
};
