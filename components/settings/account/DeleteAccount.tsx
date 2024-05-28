'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from 'next-intl';
import Warning from '@/components/ui/warning';
import { z } from 'zod';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';
import { LoadingState } from '@/components/ui/loading-state';

interface Props {
	userEmail: string;
}

export const DeleteAccount = ({ userEmail }: Props) => {
	const t = useTranslations('SETTINGS.ACCOUNT');
	const m = useTranslations('MESSAGES');

	const lang = useLocale();
	const { toast } = useToast();

	const deleteAccountSchema = z.object({
		email: z
			.string()
			.email('SCHEMA.EMAIL')
			.refine((email) => email === userEmail, 'SCHEMA.EMAIL'),
	});

	type DeleteAccountSchema = z.infer<typeof deleteAccountSchema>;

	const form = useForm<DeleteAccountSchema>({
		resolver: zodResolver(deleteAccountSchema),
		defaultValues: {
			email: '',
		},
	});

	const { mutate: deleteProfile, isLoading } = useMutation({
		mutationFn: async (formData: DeleteAccountSchema) => {
			const { data } = (await axios.post(
				'/api/profile/delete',
				formData
			)) as AxiosResponse<DeleteAccountSchema>;

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

			signOut({
				callbackUrl: `${window.location.origin}/${lang}`,
			});
		},
		mutationKey: ['deleteProfile'],
	});

	const onSubmit = (data: DeleteAccountSchema) => {
		deleteProfile(data);
	};
	return (
		<Card className='bg-background border-none shadow-none max-w-2xl'>
			<CardHeader>
				<CardTitle>{t('DELETE_TITLE')}</CardTitle>
				<CardDescription>{t('DELETE_DESC')}</CardDescription>
			</CardHeader>
			<CardContent className='pt-0 sm:pt-0'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 w-full max-w-sm'>
						<div className='space-y-2 sm:space-y-4  w-full'>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem className='w-full'>
										<FormLabel className='text-muted-foreground uppercase text-xs'>
											{t('DELETE_LABEL')}
										</FormLabel>
										<FormControl>
											<Input placeholder={t('DELETE_PLACEHOLDER')} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Dialog>
							<DialogTrigger asChild>
								<Button
									disabled={!form.formState.isValid}
									variant={'destructive'}
									className=''
									type='button'>
									{t('DELETE_BTN')}
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle className='text-destructive'>{t('DIALOG.TITLE')}</DialogTitle>
									<DialogDescription>{t('DIALOG.DESC')}</DialogDescription>
								</DialogHeader>

								<Warning>
									<p>{t('DIALOG.WARNING')}</p>
								</Warning>

								<Button
									disabled={isLoading}
									onClick={form.handleSubmit(onSubmit)}
									size={'lg'}
									variant={'destructive'}>
									{isLoading ? (
										<LoadingState loadingText={t('DIALOG.PENDING_BTN')} />
									) : (
										t('DIALOG.BUTTON')
									)}
								</Button>
							</DialogContent>
						</Dialog>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
