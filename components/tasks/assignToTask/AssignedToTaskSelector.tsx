'use client';
import React, { useEffect, useState } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Users2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingState } from '@/components/ui/loading-state';
import { CommandContainer } from './CommandContainer';
import { useQuery } from '@tanstack/react-query';
import { UsersAssingedToTaskInfo } from '@/types/extended';
import { useTranslations } from 'next-intl';
import { useUserEditableWorkspaces } from '@/context/UserEditableWorkspaces';

interface Props {
	className?: string;
	plusIconSize?: number;
	dropDownSizeOffset?: number;
	workspaceId: string;
	taskId: string;
}

export const AssignedToTaskSelector = ({
	className,
	dropDownSizeOffset,
	plusIconSize = 16,
	taskId,
	workspaceId,
}: Props) => {
	const t = useTranslations('TASK.ASSIGNMENT');
	const [canEdit, setCanEdit] = useState(false);

	const {
		data: editableWorksapces,
		isError: isErrorGettingWorkspaces,
		isLoading: isGettingWorkspaces,
		refetch: refetchWorkspaces,
	} = useUserEditableWorkspaces();

	useEffect(() => {
		if (editableWorksapces) {
			const inThisWorkspace = editableWorksapces.some((workspace) => workspace.id === workspaceId);

			setCanEdit(inThisWorkspace);
		}
	}, [editableWorksapces, workspaceId]);

	const {
		data: assgingedUsersInfo,
		isLoading: isLodingInfo,
		isError: isErrorGettingAssignedUser,
		refetch: refetchAssigned,
	} = useQuery({
		queryFn: async () => {
			const res = await fetch(
				`/api/assigned_to/tasks/get?workspaceId=${workspaceId}&taskId=${taskId}`
			);

			if (!res.ok) throw new Error();

			const data = await res.json();
			return data as UsersAssingedToTaskInfo;
		},

		queryKey: ['getAssignedToTaskInfo', taskId],
	});

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					className={cn(
						`w-fit h-fit text-xs justify-start text-left font-normal px-2.5 py-0.5 `,
						className
					)}
					variant={'outline'}
					size={'sm'}>
					<Users2 size={plusIconSize} className='mr-1 ' />
					<span>{t('TRIGGER')}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent sideOffset={dropDownSizeOffset && dropDownSizeOffset}>
				{(isLodingInfo || isGettingWorkspaces) && (
					<div className=' p-3  flex justify-center items-center'>
						<LoadingState />
					</div>
				)}
				{!isLodingInfo && !isGettingWorkspaces && assgingedUsersInfo && (
					<CommandContainer
						users={assgingedUsersInfo.subscribers}
						taskId={taskId}
						workspaceId={workspaceId}
						canEdit={canEdit}
					/>
				)}
				{isErrorGettingAssignedUser && (
					<div className='p-3 text-sm flex justify-center items-center flex-col gap-4 '>
						<p>{t('ERROR_MSG')}</p>
						<Button
							className='w-full'
							size={'sm'}
							variant={'default'}
							onClick={() => refetchAssigned()}>
							{t('ERROR_BTN')}
						</Button>
					</div>
				)}
				{isErrorGettingWorkspaces && (
					<div className='p-3 text-sm flex justify-center items-center flex-col gap-4 '>
						<p>{t('ERROR_MSG')}</p>
						<Button
							className='w-full'
							size={'sm'}
							variant={'default'}
							onClick={() => refetchWorkspaces()}>
							{t('ERROR_BTN')}
						</Button>
					</div>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
