'use client';
import React from 'react';
import { CommandItem } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/user-avatar';
import { Check } from 'lucide-react';
import { useTuncateText } from '@/hooks/useTruncateText';
import { FilterUser } from '@/types/extended';
import { useFilterByUsersAndTagsInWorkspace } from '@/context/FilterByUsersAndTagsInWorkspace';
import { useTranslations } from 'next-intl';

interface Props extends FilterUser {
	sessionUserId: string;
	active: boolean;
}

export const CommandUserItem = ({ username, id, image, sessionUserId, active }: Props) => {
	const t = useTranslations('WORKSPACE_MAIN_PAGE.COMMAND');

	const { onChangeAssigedUser } = useFilterByUsersAndTagsInWorkspace();
	const name = useTuncateText(username, 25, 0);

	return (
		<CommandItem className='p-0'>
			<Button
				onClick={() => {
					onChangeAssigedUser(id);
				}}
				size={'sm'}
				variant={'ghost'}
				className='w-full h-fit justify-between px-2 py-1.5 text-xs'>
				<div className='flex items-center gap-2'>
					<UserAvatar className='w-8 h-8' size={10} profileImage={image} />

					<p className='text-secondary-foreground'>
						{sessionUserId === id ? t('ASSIGNED_TO_ME') : name}
					</p>
				</div>

				{active && <Check className='text-primary' size={16} />}
			</Button>
		</CommandItem>
	);
};
