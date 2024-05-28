'use client';
import { useUserActivityStatus } from '@/context/UserActivityStatus';
import React from 'react';
import { UserStatusTypeList } from './UserStatusTypeList';
import { LoadingState } from '@/components/ui/loading-state';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export const UsersContainer = () => {
	const t = useTranslations('USERS_STATUS_LIST');
	const { isLoading, getActiveUsersRoleType, allInactiveUsers, isError, refetch } =
		useUserActivityStatus();

	const owners = getActiveUsersRoleType('OWNER');
	const admins = getActiveUsersRoleType('ADMIN');
	const editors = getActiveUsersRoleType('CAN_EDIT');
	const viewers = getActiveUsersRoleType('READ_ONLY');

	if (isError)
		return (
			<div className='flex flex-col justify-center text-center items-center gap-4 mt-6 '>
				<p className='text-sm text-muted-foreground'>{t('ERROR.MG')}</p>
				<Button size={'sm'} onClick={refetch}>
					{t('ERROR.BTN')}
				</Button>
			</div>
		);
	else
		return (
			<div className='flex flex-col gap-6 '>
				{isLoading ? (
					<div className='flex justify-center items-center w-full mt-2 h-28'>
						<LoadingState />
					</div>
				) : (
					<>
						<UserStatusTypeList title={t('ROLES.OWNER')} users={owners} active />
						<UserStatusTypeList title={t('ROLES.ADMIN')} users={admins} active />
						<UserStatusTypeList title={t('ROLES.CAN_EDIT')} users={editors} active />
						<UserStatusTypeList title={t('ROLES.READ_ONLY')} users={viewers} active />
						<UserStatusTypeList title={t('ROLES.UNAVAILABLE')} users={allInactiveUsers} />
					</>
				)}
			</div>
		);
};
