'use client';

import React, { useMemo, useState } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, ChevronDown, Copy, Link, RefreshCcw, UserPlus2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useToast } from '@/components/ui/use-toast';
import { useLocale, useTranslations } from 'next-intl';
import { Workspace } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { LoadingState } from '@/components/ui/loading-state';
import { domain } from '@/lib/api';
import { useRouter } from 'next-intl/client';
import { useChangeCodeToEmoji } from '@/hooks/useChangeCodeToEmoji';

interface Props {
	workspace: Workspace;
}

export const InviteContent = ({
	workspace: { id, adminCode, canEditCode, inviteCode, readOnlyCode },
}: Props) => {
	const [selectedRole, setSelectedRole] = useState<'viewer' | 'admin' | 'editor'>('editor');
	const [codes, setCodes] = useState({ adminCode, canEditCode, inviteCode, readOnlyCode });
	const { toast } = useToast();

	const userRoleEmojis = useChangeCodeToEmoji('1f60e', '1f920', '1f913');

	const router = useRouter();
	const lang = useLocale();

	const t = useTranslations('PERMISSONS');
	const m = useTranslations('MESSAGES');

	const inviteURL = useMemo(() => {
		const shareCode = () => {
			switch (selectedRole) {
				case 'admin':
					return codes.adminCode;
				case 'editor':
					return codes.canEditCode;
				case 'viewer':
					return codes.readOnlyCode;
			}
		};

		return `${domain}/${lang}/dashboard/invite/${
			codes.inviteCode
		}?role=${selectedRole}&shareCode=${shareCode()}`;
	}, [codes, lang, selectedRole]);

	const copyHanlder = () => {
		navigator.clipboard.writeText(inviteURL);

		toast({
			title: 'Link skopiowany',
		});
	};

	const { mutate: regenerateLink, isLoading } = useMutation({
		mutationFn: async () => {
			const { data } = (await axios.post('/api/workspace/invite/regenerate_link', {
				id,
			})) as AxiosResponse<Workspace>;

			setCodes({
				adminCode: data.adminCode,
				canEditCode: data.canEditCode,
				inviteCode: data.inviteCode,
				readOnlyCode: data.readOnlyCode,
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
			toast({
				title: m('SUCCES.REGENERATED_LINK'),
			});
			router.refresh();
		},
		mutationKey: ['regenerateLink', id],
	});

	return (
		<div>
			<div className='space-y-4 my-6'>
				<div className='h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm  flex items-center justify-between'>
					<div className='flex items-center gap-4 mr-2'>
						<Link className='w-5 h-5' size={18} />
						<HoverCard openDelay={250} closeDelay={250}>
							<HoverCardTrigger asChild>
								<p className=' overflow-hidden break-all h-5 w-full  inline-block  '>{inviteURL}</p>
							</HoverCardTrigger>
							<HoverCardContent className='max-w-xs sm:max-w-sm md:max-w-md lg:max-w-4xl'>
								<p className='break-words'>{inviteURL}</p>
							</HoverCardContent>
						</HoverCard>
					</div>
					<Button
						disabled={isLoading}
						onClick={() => {
							regenerateLink();
						}}
						className={`px-0 w-5 h-5 hover:bg-background hover:text-muted-foreground `}
						size={'icon'}
						variant={'ghost'}>
						{isLoading ? <LoadingState size={18} /> : <RefreshCcw size={18} />}
					</Button>
				</div>
				<div className=' h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm  flex items-center justify-between'>
					<div className='flex items-center gap-4'>
						<UserPlus2 className='w-5 h-5' size={18} />
						<span>{t('PERMISSONS')}</span>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant={'ghost'}
								size={'sm'}
								className='flex gap-1 items-center px-0 h-fit hover:bg-background hover:text-muted-foreground'>
								{selectedRole === 'admin' && (
									<p className='flex gap-1 items-center'>
										<span>{userRoleEmojis[0]}</span> <span>{t('ADMIN.TITLE')}</span>
									</p>
								)}
								{selectedRole === 'editor' && (
									<p className='flex gap-1 items-center'>
										<span>{userRoleEmojis[1]}</span> <span>{t('EDITOR.TITLE')}</span>
									</p>
								)}
								{selectedRole === 'viewer' && (
									<p className='flex gap-1 items-center'>
										<span>{userRoleEmojis[2]}</span> <span>{t('VIEWER.TITLE')}</span>
									</p>
								)}

								<ChevronDown size={16} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent side='right' align='center' sideOffset={15} className='max-w-xs'>
							<DropdownMenuItem
								className='cursor-pointer'
								onClick={() => {
									setSelectedRole('admin');
								}}>
								<div className='flex flex-col gap-1'>
									<div className='flex items-center gap-2'>
										<div className='flex items-center gap-1 text-sm sm:text-base'>
											<span>{userRoleEmojis[0]}</span>
											<h3>{t('ADMIN.TITLE')}</h3>
										</div>
										{selectedRole === 'admin' && <Check size={18} />}
									</div>
									<p className='text-muted-foreground text-xs sm:text-sm '>{t('ADMIN.DESC')}</p>
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem
								className='cursor-pointer'
								onClick={() => {
									setSelectedRole('editor');
								}}>
								<div className='flex flex-col gap-1'>
									<div className='flex items-center gap-2'>
										<div className='flex items-center gap-1 text-sm sm:text-base'>
											<span>{userRoleEmojis[1]}</span>
											<h3>{t('EDITOR.TITLE')}</h3>
										</div>
										{selectedRole === 'editor' && <Check size={18} />}
									</div>
									<p className='text-muted-foreground text-xs sm:text-sm'>{t('EDITOR.DESC')}</p>
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem
								className='cursor-pointer'
								onClick={() => {
									setSelectedRole('viewer');
								}}>
								<div className='flex flex-col gap-1'>
									<div className='flex items-center gap-2'>
										<div className='flex gap-1 items-center text-sm sm:text-base'>
											<span>{userRoleEmojis[2]}</span>
											<h3>{t('VIEWER.TITLE')}</h3>
										</div>
										{selectedRole === 'viewer' && <Check size={18} />}
									</div>
									<p className='text-muted-foreground text-xs sm:text-sm '>{t('VIEWER.DESC')}</p>
								</div>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<Button
				disabled={isLoading}
				onClick={copyHanlder}
				className='w-full text-white font-bold flex items-center gap-2'>
				<Copy size={18} />
				{t('COPY')}
			</Button>
		</div>
	);
};
