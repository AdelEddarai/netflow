'use client';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { UserPermisson } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createContext } from 'react';
import { UserActiveItemList } from '@/types/extended';
import { useParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useTranslations } from 'next-intl';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { supabase } from '@/lib/supabase';
import { useSession } from 'next-auth/react';

interface Props {
	children: React.ReactNode;
}

interface UserActivityStatus {
	isLoading: boolean;
	isError: boolean;

	allUsers: UserActiveItemList[];
	allActiveUsers: UserActiveItemList[];
	allInactiveUsers: UserActiveItemList[];

	getActiveUsersRoleType: (role: UserPermisson) => UserActiveItemList[];
	chekIfUserIsActive: (id: string) => boolean;
	refetch: () => void;
}

export const UserActivityStatusCtx = createContext<UserActivityStatus | null>(null);

export const UserActivityStatusProvider = ({ children }: Props) => {
	const { toast } = useToast();
	const m = useTranslations('MESSAGES');

	const [allInactiveUsers, setAllInactiveUsers] = useState<UserActiveItemList[]>([]);
	const [allActiveUsers, setAllActiveUsers] = useState<UserActiveItemList[]>([]);

	const params = useParams();
	const session = useSession();
	const worksapceId = params.workspace_id ? params.workspace_id : null;

	const {
		data: users,
		isError,
		isLoading,
		refetch,
	} = useQuery<UserActiveItemList[], Error>({
		queryFn: async () => {
			const res = await fetch(`/api/users/get-users?workspaceId=${worksapceId}`);

			if (!res.ok) {
				const error = (await res.json()) as string;
				throw new Error(error);
			}

			const resposne = await res.json();

			return resposne;
		},
		enabled: !!worksapceId,
		queryKey: ['getUserActivityStatus', worksapceId],
	});

	useEffect(() => {
		if (!session.data) return;
		const supabaseClient = supabase();
		const channel = supabaseClient.channel(`activity-status`);
		channel
			.on('presence', { event: 'sync' }, () => {
				const userIds: string[] = [];
				const activeUsers: UserActiveItemList[] = [];
				const inactiveUsers: UserActiveItemList[] = [];

				for (const id in channel.presenceState()) {
					// @ts-ignore
					userIds.push(channel.presenceState()[id][0].user_id);
				}
				const uniqeIds = new Set(userIds);

				users &&
					users.forEach((user) => {
						if (uniqeIds.has(user.id)) {
							activeUsers.push(user);
						} else {
							inactiveUsers.push(user);
						}
					});

				setAllActiveUsers(activeUsers);
				setAllInactiveUsers(inactiveUsers);
			})
			.subscribe(async (status) => {
				if (status === 'SUBSCRIBED') {
					await channel.track({
						online_at: new Date().toISOString(),
						user_id: session.data.user.id,
					});
				}
			});
	}, [session.data, users]);

	const getActiveUsersRoleType = useCallback(
		(role: UserPermisson) => {
			return allActiveUsers.filter((user) => user.userRole === role);
		},
		[allActiveUsers]
	);

	const chekIfUserIsActive = useCallback(
		(id: string) => !!allActiveUsers.find((user) => user.id === id),
		[allActiveUsers]
	);

	const info: UserActivityStatus = {
		isLoading,
		isError,
		allUsers: users ?? [],
		allActiveUsers,
		allInactiveUsers,
		getActiveUsersRoleType,
		chekIfUserIsActive,
		refetch,
	};

	return <UserActivityStatusCtx.Provider value={info}>{children}</UserActivityStatusCtx.Provider>;
};

export const useUserActivityStatus = () => {
	const ctx = useContext(UserActivityStatusCtx);
	if (!ctx) throw new Error('invalid use');

	return ctx;
};
