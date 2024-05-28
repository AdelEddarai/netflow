'use client';
import React from 'react';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { ChangePasswordSchema, changePasswordSchema } from '@/schema/changePasswordSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useTranslations } from 'next-intl';
import { User } from '@prisma/client';
import { useRouter } from 'next-intl/client';
import { LoadingState } from '@/components/ui/loading-state';

export const ChangePassword = () => {
	const t = useTranslations('SETTINGS.SECURITY.FORM');
	const m = useTranslations('MESSAGES');

	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<ChangePasswordSchema>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			current_password: '',
			new_password: '',
			repeat_password: '',
		},
	});

	const { mutate: changePassword, isLoading } = useMutation({
		mutationFn: async (formData: ChangePasswordSchema) => {
			const { data } = (await axios.post(
				'/api/profile/change_password',
				formData
			)) as AxiosResponse<User>;

			return data;
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
				title: m('SUCCES.DELETED_INFO'),
			});
			router.refresh();
			form.reset();
		},
		mutationKey: ['chnagePassword'],
	});

	const onSubmit = (data: ChangePasswordSchema) => {
		changePassword(data);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 p-0 sm:p-0 w-full max-w-md'>
				<div className='space-y-2 sm:space-y-4  w-full'>
					<FormField
						control={form.control}
						name='current_password'
						render={({ field }) => (
							<FormItem className='w-full'>
								<FormLabel className='text-muted-foreground uppercase text-xs'>
									{t('CURRENT.LABEL')}
								</FormLabel>
								<FormControl>
									<Input
										type='password'
										className='bg-muted'
										placeholder={t('CURRENT.PLACEHOLDER')}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='new_password'
						render={({ field }) => (
							<FormItem className='w-full'>
								<FormLabel className='text-muted-foreground uppercase text-xs'>
									{t('NEW.LABEL')}
								</FormLabel>
								<FormControl>
									<Input
										type='password'
										className='bg-muted'
										placeholder={t('NEW.PLACEHOLDER')}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='repeat_password'
						render={({ field }) => (
							<FormItem className='w-full'>
								<FormLabel className='text-muted-foreground uppercase text-xs'>
									{t('REPEAT.LABEL')}
								</FormLabel>
								<FormControl>
									<Input
										type='password'
										className='bg-muted'
										placeholder={t('REPEAT.PLACEHOLDER')}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<Button disabled={isLoading} className='text-white '>
					{isLoading ? <LoadingState loadingText={t('BTN_PENDING')} /> : t('BTN')}
				</Button>
			</form>
		</Form>
	);
};
