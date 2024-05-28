'use client';
import React from 'react';
import { UserAvatar } from '@/components/ui/user-avatar';
import { UserPermisson as UserPermissonType } from '@prisma/client';

import { UserPermisson } from './UserPermisson';
import { MoreOptions } from './MoreOptions';
import { SubscriptionUser } from '@/types/extended';
interface Props {
	userRole: UserPermissonType;
	user: {
		id: string;
		image?: string | null | undefined;
		username: string;
	};
	workspaceId: string;
	onSetWorkspacesubscribers: React.Dispatch<React.SetStateAction<SubscriptionUser[]>>;
}

export const MembersRow = ({ user, userRole, workspaceId, onSetWorkspacesubscribers }: Props) => {
	return (
		<li className='w-full items-center grid grid-cols-3 grid-rows-1 gap-4 p-4 border-b last:border-b-0 text-sm sm:text-base h-16 '>
			<div className='flex items-center gap-2'>
				<UserAvatar profileImage={user.image} size={14} className='w-8 h-8 hidden sm:flex' />
				<p className='font-semibold'>{user.username}</p>
			</div>
			<UserPermisson
				user={user}
				userRole={userRole}
				workspaceId={workspaceId}
				onSetWorkspacesubscribers={onSetWorkspacesubscribers}
			/>
			<MoreOptions
				userRole={userRole}
				userId={user.id}
				workspaceId={workspaceId}
				onSetWorkspacesubscribers={onSetWorkspacesubscribers}
			/>
		</li>
	);
};
