'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CommandItem } from '@/components/ui/command';
import { UserAvatar } from '@/components/ui/user-avatar';
import { AssignedToTaskUser } from '@/types/extended';
import { Check } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useTranslations } from 'next-intl';
import { useTuncateText } from '@/hooks/useTruncateText';

interface Props {
	user: AssignedToTaskUser;
	taskId: string;
	workspaceId: string;
	canEdit: boolean;
}

export const CommandUser = ({ user, taskId, workspaceId, canEdit }: Props) => {
	const username = useTuncateText(user.user.username, 25, 0);

	const [isActiveUser, setIsActiveUser] = useState(
		user.user.assignedToTask.length === 1 ? true : false
	);

	const m = useTranslations('MESSAGES');

	const queryClient = useQueryClient();
	const { toast } = useToast();

	const { mutate: handleTaskAssigment } = useMutation({
		mutationFn: async () => {
			await axios.post('/api/assigned_to/tasks/assign', {
				taskId,
				workspaceId,
				assignToUserId: user.user.id,
			});
		},
		onMutate: async () => {
			await queryClient.cancelQueries(['getAssignedToTaskInfo']);

			setIsActiveUser((prev) => !prev);
		},
		onError: (err: AxiosError) => {
			setIsActiveUser((prev) => !prev);
			const error = err?.response?.data ? err.response.data : 'ERRORS.DEFAULT';

			toast({
				title: m(error),
				variant: 'destructive',
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries(['getAssignedToTaskInfo', taskId]);
		},

		mutationKey: ['handleTaskAssigment', taskId],
	});

	return (
		<CommandItem className='p-0'>
			<Button
				disabled={!canEdit}
				onClick={() => {
					handleTaskAssigment();
				}}
				size={'sm'}
				variant={'ghost'}
				className='w-full h-fit justify-between px-2 py-1.5 text-xs'>
				<div className='flex items-center gap-2'>
					<UserAvatar className='w-8 h-8' size={10} profileImage={user.user.image} />
					<p className='text-secondary-foreground'>{username}</p>
				</div>

				{isActiveUser && <Check className='text-primary' size={16} />}
			</Button>
		</CommandItem>
	);
};
