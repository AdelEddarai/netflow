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
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { LoadingState } from '@/components/ui/loading-state';
import { UserPermisson } from '@prisma/client';

interface Props {
	isSaved: boolean;
	workspaceId: string;
	mindMapId: string;
	userRole: UserPermisson | null;
	onSetIsSaved: () => void;
}

export const MindMapCardPreviewOptions = ({
	isSaved,
	workspaceId,
	mindMapId,
	userRole,
	onSetIsSaved,
}: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const m = useTranslations('MESSAGES');
	const t = useTranslations('MIND_MAP.PREVIEW');

	const queryClient = useQueryClient();
	const { toast } = useToast();
	const router = useRouter();

	const { mutate: deleteMindMap, isLoading } = useMutation({
		mutationFn: async () => {
			await axios.post('/api/mind_maps/delete', {
				mindMapId,
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
				title: m('SUCCES.MIND_MAP_DELETED'),
			});

			queryClient.invalidateQueries(['getWorkspaceShortcuts']);

			router.push(`/dashboard/workspace/${workspaceId}`);
			router.refresh();
		},

		mutationKey: ['deleteTask'],
	});

	const { mutate: toogleSaveMindMap } = useMutation({
		mutationFn: async () => {
			await axios.post('/api/saved/mind_maps/toggle_mind_map', {
				mindMapId,
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

		mutationKey: ['toogleSaveMindMap'],
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
								toogleSaveMindMap();
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
									<Link
										href={`/dashboard/workspace/${workspaceId}/mind-maps/mind-map/${mindMapId}/edit`}>
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
							deleteMindMap();
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
