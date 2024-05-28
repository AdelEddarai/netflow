'use client';
import React from 'react';
import { UserAvatar } from '@/components/ui/user-avatar';
import { useTuncateText } from '@/hooks/useTruncateText';
import { WorkspaceRecentActivityAssignedToItem } from '@/types/extended';

interface Props {
	userInfo: WorkspaceRecentActivityAssignedToItem;
}

export const AssignedToTaskUser = ({
	userInfo: {
		user: { image, username },
	},
}: Props) => {
	const name = useTuncateText(username, 25, 0);

	return (
		<div className='w-fit  flex gap-2 items-center px-2.5 py-0.5  h-fit   text-xs rounded-lg border border-input bg-background '>
			<UserAvatar className='w-4 h-4' size={10} profileImage={image} />
			<p className='text-secondary-foreground'>{name}</p>
		</div>
	);
};
