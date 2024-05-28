'use client';
import React from 'react';
import { UserAvatar } from '../ui/user-avatar';
import { BellDot } from 'lucide-react';
import { useTuncateText } from '@/hooks/useTruncateText';
import { UserNotification } from '@/types/extended';
import { useFormatter, useTranslations } from 'next-intl';
import Link from 'next-intl/link';
import { useCreateNotifayItem } from '@/hooks/useCreateNotifayItem';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useToast } from '../ui/use-toast';

interface Props {
	notifay: UserNotification;
}

export const NotificationItem = ({
	notifay: {
		notifayCreator: { image, username },
		cliked,
		createdDate,
		workspace,
		newUserRole,
		taskId,
		mindMapId,
		notfiyType,
		id,
	},
}: Props) => {
	const m = useTranslations('MESSAGES');
	const queryClient = useQueryClient();

	const format = useFormatter();
	const dateTime = new Date(createdDate);
	const now = new Date();

	const { toast } = useToast();
	const name = useTuncateText(username, 20);

	const { link, textContent } = useCreateNotifayItem(
		notfiyType,
		newUserRole,
		workspace,
		taskId,
		mindMapId
	);

	const { mutate: updateToClickStatus } = useMutation({
		mutationFn: async () => {
			await axios.post('/api/notifications/set-click/by-id', { id });
		},
		onMutate: async () => {
			await queryClient.cancelQueries(['getUserNotifications']);
			const previousNotifications = queryClient.getQueryData<UserNotification[]>([
				'getUserNotifications',
			]);

			const checkedPreviousNotifications =
				previousNotifications && previousNotifications.length > 0 ? previousNotifications : [];

			const updatedNotifications = checkedPreviousNotifications.map((notifay) => {
				if (notifay.id === id)
					return {
						...notifay,
						cliked: true,
					};
				else return notifay;
			});

			queryClient.setQueryData(['getUserNotifications'], updatedNotifications);

			return { checkedPreviousNotifications };
		},
		onError: (err: AxiosError, _, context) => {
			queryClient.setQueryData(['getUserNotifications'], context?.checkedPreviousNotifications);

			toast({
				title: m('ERRORS.CANT_UPDATE_SEEN_NOTIFY'),
				variant: 'destructive',
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries(['getUserNotifications']);
		},

		mutationKey: ['updateToClickStatus'],
	});

	return (
		<Link
			onClick={() => {
				!cliked && updateToClickStatus();
			}}
			href={link}>
			<div className='flex gap-4 hover:bg-accent transition-colors duration-200 px-2 py-1 rounded-sm cursor-pointer'>
				<div>
					<UserAvatar profileImage={image} className='w-10 h-10' size={12} />
				</div>
				<div className='flex gap-4 w-full justify-between '>
					<div className='w-full text-sm flex flex-col gap-1'>
						<p>
							<span className='font-bold'>{name}</span> <span>{textContent}</span>
						</p>
						<p
							className={`text-xs transition-colors duration-200 ${
								cliked ? 'text-muted-foreground' : ' text-primary font-bold'
							}`}>
							{format.relativeTime(dateTime, now)}
						</p>
					</div>
					{!cliked && (
						<div>
							<div className='h-6 w-6 text-primary'>
								<BellDot size={16} />
							</div>
						</div>
					)}
				</div>
			</div>
		</Link>
	);
};
