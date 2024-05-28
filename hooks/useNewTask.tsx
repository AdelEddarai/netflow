'use client';

import { useToast } from '@/components/ui/use-toast';
import { Task } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';

export const useNewTask = (workspaceId: string) => {
	const m = useTranslations('MESSAGES');

	const { toast } = useToast();
	const router = useRouter();

	const { mutate: newTask, isLoading } = useMutation({
		mutationFn: async () => {
			const { data } = await axios.post('/api/task/new/', {
				workspaceId,
			});
			return data;
		},

		onSuccess: (data: Task) => {
			toast({
				title: m('SUCCES.TASK_ADDED'),
			});
			router.push(`/dashboard/workspace/${workspaceId}/tasks/task/${data.id}/edit`);
		},

		onError: (err: AxiosError) => {
			const error = err?.response?.data ? err.response.data : 'ERRORS.DEFAULT';

			toast({
				title: m(error),
				variant: 'destructive',
			});
		},

		mutationKey: ['newTask'],
	});

	return { newTask, isLoading };
};
