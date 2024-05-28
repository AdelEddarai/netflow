import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserPlus2 } from 'lucide-react';
import { Workspace } from '@prisma/client';
import { InviteContent } from './InviteContent';
import { useTranslations } from 'next-intl';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface Props {
	workspace: Workspace;
}

export const InviteUsers = ({ workspace }: Props) => {
	const t = useTranslations('INVITE');
	return (
		<Dialog>
			<HoverCard openDelay={250} closeDelay={250}>
				<DialogTrigger asChild>
					<HoverCardTrigger>
						<Button
							size={'icon'}
							className='w-6 h-6  sm:h-9 sm:w-auto sm:bg-primary/10 sm:text-primary sm:font-semibold sm:hover:bg-primary sm:hover:text-white sm:rounded-md sm:px-3 sm:space-x-2 text-primary'
							variant='ghost'>
							<span className='hidden sm:inline'>{t('INVITE')}</span>
							<UserPlus2 size={18} />
						</Button>
					</HoverCardTrigger>
				</DialogTrigger>
				<HoverCardContent align='center'>
					<span>{t('HINT')}</span>
				</HoverCardContent>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							<span>{t('TITLE')}</span> <span>{workspace.name}</span>
						</DialogTitle>
						<DialogDescription>{t('DESC')}</DialogDescription>
					</DialogHeader>
					<InviteContent workspace={workspace} />
				</DialogContent>
			</HoverCard>
		</Dialog>
	);
};
