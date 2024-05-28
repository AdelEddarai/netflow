'use client';
import React from 'react';
import { SettingsWorkspace } from '@/types/extended';
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
import { useTranslations } from 'next-intl';
import Warning from '@/components/ui/warning';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import { LoadingState } from '@/components/ui/loading-state';
import { useRouter } from 'next-intl/client';

interface Props {
	workspace: SettingsWorkspace;
}

export const DeleteWorkspace = ({ workspace: { id, name } }: Props) => {
	const t = useTranslations('EDIT_WORKSPACE.DELETE');
	const m = useTranslations('MESSAGES');

	const router = useRouter();
	const { toast } = useToast();

	const deleteWorkspaceSchema = z.object({
		workspaceName: z
			.string()
			.refine((workspaceName) => workspaceName === name, 'SCHEMA.WORKSPACE.WORNG_NAME'),
	});

	type DeleteWorkspaceSchema = z.infer<typeof deleteWorkspaceSchema>;

	const form = useForm<DeleteWorkspaceSchema>({
		resolver: zodResolver(deleteWorkspaceSchema),
		defaultValues: {
			workspaceName: '',
		},
	});

	const { mutate: deleteProfile, isLoading } = useMutation({
		mutationFn: async (formData: DeleteWorkspaceSchema) => {
			await axios.post('/api/workspace/delete/workspace', {
				id,
				workspaceName: formData.workspaceName,
			});
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
				title: m('SUCCES.DELETED_WORKSPACE_INFO'),
			});
			router.push('/dashboard/settings');
			router.refresh();
		},
		mutationKey: ['deleteWorkspace'],
	});

	const onSubmit = (data: DeleteWorkspaceSchema) => {
		deleteProfile(data);
	};
	return (
		<Card className='bg-background border-none shadow-none max-w-3xl '>
			<CardHeader>
				<CardTitle>{t('TITLE')}</CardTitle>
				<CardDescription>{t('DESC')}</CardDescription>
			</CardHeader>
			<CardContent className='pt-0 sm:pt-0'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 w-full max-w-md  '>
						<div className='space-y-2 sm:space-y-4  w-full'>
							<FormField
								control={form.control}
								name='workspaceName'
								render={({ field }) => (
									<FormItem className='w-full'>
										<FormLabel className='text-muted-foreground uppercase text-xs'>
											{t('LABEL')}
										</FormLabel>
										<FormControl>
											<Input placeholder={name} {...field} />
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
									{t('BTN')}
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
