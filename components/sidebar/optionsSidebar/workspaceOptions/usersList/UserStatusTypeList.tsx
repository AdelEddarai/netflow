import { UserActiveItemList } from '@/types/extended';
import React from 'react';
import { UserStatus } from './UserStatus';

interface Props {
	users: UserActiveItemList[];
	title: string;
	active?: boolean;
}

export const UserStatusTypeList = ({ title, users, active }: Props) => {
	if (users.length === 0) return null;
	return (
		<div>
			<p className='text-xs sm:text-sm uppercase text-muted-foreground '>
				{title} - {users.length}
			</p>
			<div className='flex flex-col gap-2 w-full mt-2 '>
				{users.map((user) => (
					<UserStatus key={user.id} image={user.image} username={user.username} active={active} />
				))}
			</div>
		</div>
	);
};
