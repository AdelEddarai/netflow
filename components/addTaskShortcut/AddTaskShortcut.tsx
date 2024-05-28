'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { ExternalLink, PencilRuler } from 'lucide-react';
import { Task, Workspace } from '@prisma/client';
import { ChevronLeft } from 'lucide-react';
import { useChangeCodeToEmoji } from '@/hooks/useChangeCodeToEmoji';
import { MainTab } from './MainTab';
import { Workspaces } from './Workspaces';
import { DateRange } from 'react-day-picker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next-intl/client';
import { useToast } from '@/components/ui/use-toast';
import { useTranslations } from 'next-intl';
import { LoadingState } from '../ui/loading-state';
import Link from 'next-intl/link';
import { useUserEditableWorkspaces } from '@/context/UserEditableWorkspaces';
import { ClientError } from '@/components/error/ClientError';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface Props {
	userId: string;
}

export const AddTaskShortcut = ({ userId }: Props) => {
	const {
		data: workspaces,
		isError,
		isLoading: isGettingWorkspaces,
		refetch,
	} = useUserEditableWorkspaces();

	const t = useTranslations('TASK_SHORTCUT');
	const m = useTranslations('MESSAGES');

	const queryClient = useQueryClient();

	const [currentTab, setCurrentTab] = useState<'main' | 'workspaces'>('main');
	const [open, setOpen] = useState(false);

	const [selectedEmoji, setSelectedEmoji] = useState('1f9e0');
	const renderedEmoji = useChangeCodeToEmoji(selectedEmoji);

	const router = useRouter();
	const { toast } = useToast();

	const [newTaskLink, setNewTaskLink] = useState<null | string>(null);

	const [activeWorkspace, setActiveWorksapce] = useState<null | Workspace>(null);

	useEffect(() => {
		if (workspaces) setActiveWorksapce(workspaces[0]);
	}, [workspaces]);

	const [date, setDate] = useState<DateRange | undefined>({
		from: undefined,
		to: undefined,
	});

	const [title, setTitle] = useState('');

	const selectedDateHandler = (date: DateRange | undefined) => {
		setDate(date);
	};

	const changeTitleHandler = (title: string) => {
		setTitle(title);
	};

	const selectEmojiHandler = (emoji: string) => {
		setSelectedEmoji(emoji);
	};

	const changeTabHandler = (tab: 'main' | 'workspaces') => {
		setCurrentTab(tab);
	};

	const onSelectActiveWorkspace = (workspace: Workspace) => {
		setActiveWorksapce(workspace);
		setCurrentTab('main');
	};

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;
		if (!open) {
			timeoutId = setTimeout(() => {
				setCurrentTab('main');
				setNewTaskLink(null);
			}, 200);
		}

		return () => {
			clearTimeout(timeoutId);
		};
	}, [open]);

	const { mutate: newShortTask, isLoading } = useMutation({
		mutationFn: async () => {
			const { data } = await axios.post('/api/task/create_short_task', {
				workspaceId: activeWorkspace?.id,
				icon: selectedEmoji,
				title,
				date,
			});
			return data as Task;
		},

		onSuccess: async (data: Task) => {
			await queryClient.refetchQueries(['getCalendarItems', userId]);

			toast({
				title: m('SUCCES.TASK_ADDED'),
			});

			setNewTaskLink(`/dashboard/workspace/${data.workspaceId}/tasks/task/${data.id}/edit`);
			setTitle('');
			setSelectedEmoji('1f9e0');
			setActiveWorksapce(workspaces ? workspaces[0] : null);
			setDate({
				from: undefined,
				to: undefined,
			});

			router.refresh();
		},

		onError: (err: AxiosError) => {
			const error = err?.response?.data ? err.response.data : 'ERRORS.DEFAULT';

			toast({
				title: m(error),
				variant: 'destructive',
			});
		},
		onMutate: () => {},

		mutationKey: ['newShortTask'],
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<HoverCard openDelay={250} closeDelay={250}>
				<DialogTrigger asChild>
					<HoverCardTrigger>
						<Button className='w-6 h-6  sm:h-9 sm:w-9' size={'icon'} variant='ghost'>
							<PencilRuler size={16} />
						</Button>
					</HoverCardTrigger>
				</DialogTrigger>

				<HoverCardContent align='center'>
					<span>{t('HINT')}</span>
				</HoverCardContent>

				<DialogContent className='sm:max-w-[600px]'>
					<DialogHeader>
						<div className='flex flex-col items-start gap-2'>
							{newTaskLink && (
								<Link
									onClick={() => {
										setOpen(false);
									}}
									target='_blank'
									className='w-full cursor-pointer'
									href={newTaskLink}>
									<div className='mt-6  mb-4 p-2 border border-primary rounded-md bg-primary/10 w-full text-primary font-semibold flex justify-between items-center '>
										<p>{t('ADDED_TASK')}</p>
										<ExternalLink />
									</div>
								</Link>
							)}
							<div className='flex items-center gap-2'>
								{currentTab === 'workspaces' && (
									<Button
										onClick={() => {
											changeTabHandler('main');
										}}
										className='h-8 w-8'
										variant={'ghost'}
										size={'icon'}>
										<ChevronLeft />
									</Button>
								)}
								<DialogTitle>
									{currentTab === 'main' ? t('TITLE') : t('CHOOSE_WORKSPACE')}
								</DialogTitle>
							</div>
						</div>
						{currentTab === 'main' && (
							<DialogDescription className='text-left'>{t('DESC')}</DialogDescription>
						)}
					</DialogHeader>
					{isError ? (
						<ClientError
							className='mt-0 sm:mt-0 md:mt-0 '
							message='Nie udało się pobrać Twoich danych'
							onReftech={refetch}
						/>
					) : (
						<>
							{isGettingWorkspaces ? (
								<div className='w-full h-20 flex justify-center items-center'>
									<LoadingState className='w-10 h-10' />
								</div>
							) : (
								<>
									<div className='flex flex-col w-full my-4 gap-6'>
										{currentTab === 'main' ? (
											<MainTab
												date={date}
												title={title}
												renderedEmoji={renderedEmoji}
												activeWorkspace={activeWorkspace}
												onChangeTitle={changeTitleHandler}
												onSelectedDate={selectedDateHandler}
												onChangeTabHandler={changeTabHandler}
												onSelectEmojiHandler={selectEmojiHandler}
											/>
										) : (
											<Workspaces
												workspaces={workspaces}
												onSelectActiveWorkspace={onSelectActiveWorkspace}
											/>
										)}
									</div>
									{currentTab === 'main' && (
										<DialogFooter className='w-full'>
											{activeWorkspace ? (
												<Button
													onClick={() => newShortTask()}
													disabled={!activeWorkspace || title.length === 0 || isLoading}
													size={'lg'}
													className='w-full text-white'>
													{isLoading ? (
														<LoadingState loadingText={t('BTN_PENDING')} />
													) : (
														t('BTN_ADD')
													)}
												</Button>
											) : (
												<Button
													onClick={() => {
														setOpen(false);
													}}
													size={'lg'}
													className='w-full text-white'>
													{t('BTN_NO_WORKSPACES')}
												</Button>
											)}
										</DialogFooter>
									)}
								</>
							)}
						</>
					)}
				</DialogContent>
			</HoverCard>
		</Dialog>
	);
};
