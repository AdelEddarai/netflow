'use client';

import React, { useState } from 'react';
import { UserPermisson as UserPermissonType } from '@prisma/client';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useTranslations } from 'next-intl';
import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogPortal,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogOverlay,
} from '@/components/ui/dialog';

import { useRouter } from 'next-intl/client';
import { MoreHorizontal } from 'lucide-react';
import { SubscriptionUser } from '@/types/extended';
import { LoadingState } from '@/components/ui/loading-state';
import Warning from '@/components/ui/warning';

interface Props {
	userRole: UserPermissonType;
	userId: string;
	workspaceId: string;
	onSetWorkspacesubscribers: React.Dispatch<React.SetStateAction<SubscriptionUser[]>>;
}

export const MoreOptions = ({
	userRole,
	userId,
	workspaceId,
	onSetWorkspacesubscribers,
}: Props) => {
	const [isOpen, setIsOpen] = useState(false);

	const t = useTranslations('EDIT_WORKSPACE.MEMBERS.OPTIONS');
	const m = useTranslations('MESSAGES');

	const { toast } = useToast();
	const router = useRouter();

	const { mutate: deleteUserFromWorkspace, isLoading } = useMutation({
		mutationFn: async () => {
			await axios.post('/api/workspace/users/remove', {
				userId: userId,
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
		onSuccess: async () => {
			onSetWorkspacesubscribers((current) =>
				current.filter((currentSubscribers) => {
					if (currentSubscribers.user.id !== userId) return currentSubscribers;
				})
			);
			router.refresh();
			setIsOpen(false);
		},

		mutationKey: ['deleteUserFromWorkspace'],
	});

	return (
		<div className='flex justify-end'>
			{userRole !== 'OWNER' && (
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button className='text-primary hover:text-primary' variant={'ghost'} size={'icon'}>
								<MoreHorizontal size={18} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuPortal>
							<DropdownMenuContent align='end' sideOffset={-8}>
								<DialogTrigger className='w-full'>
									<DropdownMenuItem className='cursor-pointer'>{t('REMOVE_BTN')}</DropdownMenuItem>
								</DialogTrigger>
							</DropdownMenuContent>
						</DropdownMenuPortal>
					</DropdownMenu>
					<DialogPortal>
						<DialogOverlay />
						<DialogContent>
							<DialogHeader>
								<DialogTitle>{t('REMOVE.TITLE')}</DialogTitle>
							</DialogHeader>

							<Warning blue>
								<p>{t('REMOVE.NOTE')}</p>
							</Warning>

							<Button
								onClick={() => {
									deleteUserFromWorkspace();
								}}
								disabled={isLoading}
								size={'lg'}
								variant={'secondary'}>
								{isLoading ? (
									<LoadingState loadingText={t('REMOVE.BTN_PENDING')} />
								) : (
									t('REMOVE.BTN')
								)}
							</Button>
						</DialogContent>
					</DialogPortal>
				</Dialog>
			)}
		</div>
	);
};
