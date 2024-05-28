'use client';

import React, { useState } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
	DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogPortal,
	DialogHeader,
	DialogTitle,
	DialogOverlay,
} from '@/components/ui/dialog';

import { MoreHorizontal, Pencil, Star, StarOff, Trash } from 'lucide-react';
import Warning from '@/components/ui/warning';
import Link from 'next-intl/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next-intl/client';
import { useTranslations } from 'next-intl';
import { LoadingState } from '@/components/ui/loading-state';
import { UserPermisson } from '@prisma/client';

interface Props {
	isSaved: boolean;
	taskId: string;
	workspaceId: string;
	userRole: UserPermisson | null;
	onSetIsSaved: () => void;
}

export const TaskOptons = ({ isSaved, taskId, workspaceId, userRole, onSetIsSaved }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const m = useTranslations('MESSAGES');
	const t = useTranslations('TASK.EDITOR.READ_ONLY');

	const queryClient = useQueryClient();
	const { toast } = useToast();
	const router = useRouter();

	const { mutate: deleteTask, isLoading } = useMutation({
		mutationFn: async () => {
			await axios.post('/api/task/delete', {
				taskId,
				workspaceId,
			});
		},
		onError: (err: AxiosError) => {
			const error = err?.response?.data ? err.response.data : 'ERRORS.DEFAULT';

			toast({
				title: m(error),
				variant: 'destructive',
			});
		},
		onSuccess: () => {
			toast({
				title: m('SUCCES.TASK_DELETED'),
			});

			queryClient.invalidateQueries(['getWorkspaceShortcuts']);

			router.push(`/dashboard/workspace/${workspaceId}`);
			router.refresh();
		},

		mutationKey: ['deleteTask'],
	});

	const { mutate: toogleSaveTask } = useMutation({
		mutationFn: async () => {
			await axios.post('/api/saved/tasks/toggle_task', {
				taskId,
			});
		},
		onMutate: () => {
			onSetIsSaved();
		},
		onError: (err: AxiosError) => {
			const error = err?.response?.data ? err.response.data : 'ERRORS.DEFAULT';

			onSetIsSaved();

			toast({
				title: m(error),
				variant: 'destructive',
			});
		},
		onSuccess: () => {
			router.refresh();
		},

		mutationKey: ['toogleSaveTask'],
	});

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button className='text-primary hover:text-primary' variant={'ghost'} size={'icon'}>
						<MoreHorizontal size={18} />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuPortal>
					<DropdownMenuContent align='end' sideOffset={-8}>
						<DropdownMenuItem
							onClick={() => {
								toogleSaveTask();
							}}
							className='cursor-pointer'>
							{isSaved ? (
								<>
									<StarOff size={16} className='mr-2' />
									{t('REMOVE_FROM_FAV')}
								</>
							) : (
								<>
									<Star size={16} className='mr-2' />
									{t('ADD_TO_FAV')}
								</>
							)}
						</DropdownMenuItem>
						{userRole && userRole !== 'READ_ONLY' && (
							<>
								<DropdownMenuItem className='cursor-pointer' asChild>
									<Link href={`/dashboard/workspace/${workspaceId}/tasks/task/${taskId}/edit`}>
										<Pencil size={16} className='mr-2' /> {t('EDIT')}
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DialogTrigger className='w-full'>
									<DropdownMenuItem className='cursor-pointer'>
										<Trash size={16} className='mr-2' /> {t('DELETE')}
									</DropdownMenuItem>
								</DialogTrigger>
							</>
						)}
					</DropdownMenuContent>
				</DropdownMenuPortal>
			</DropdownMenu>
			<DialogPortal>
				<DialogOverlay />
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t('DIALOG.TITLE')}</DialogTitle>
					</DialogHeader>

					<Warning>
						<p>{t('DIALOG.DESC')}</p>
					</Warning>

					<Button
						onClick={() => {
							deleteTask();
						}}
						size={'lg'}
						variant={'destructive'}>
						{isLoading ? (
							<LoadingState loadingText={t('DIALOG.BTN_PENDING')} />
						) : (
							t('DIALOG.BTN_DELETE')
						)}
					</Button>
				</DialogContent>
			</DialogPortal>
		</Dialog>
	);
};
