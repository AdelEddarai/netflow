'use client';

import React, { useState } from 'react';
import { ApiWorkspaceSchema, WorkspaceSchema, workspaceSchema } from '@/schema/workspaceSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
	Form,
	FormField,
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UploadFile } from '@/components/common/UploadFile';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useUploadThing } from '@/lib/uploadthing';
import { useTranslations } from 'next-intl';
import { LoadingState } from '@/components/ui/loading-state';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next-intl/client';

interface Props {
	onSetOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddWorkspaceForm = ({ onSetOpen }: Props) => {
	const [uplaodError, setUploadError] = useState(false);
	const { toast } = useToast();

	const t = useTranslations('NEW_WORKSPACE');
	const m = useTranslations('MESSAGES');

	const router = useRouter();

	const form = useForm<WorkspaceSchema>({
		resolver: zodResolver(workspaceSchema),
		defaultValues: {
			workspaceName: '',
		},
	});

	const { startUpload, isUploading } = useUploadThing('imageUploader', {
		onUploadError: () => {
			setUploadError(true);
			toast({
				title: m('ERRORS.WORKSPACE_ICON_ADDED'),
				variant: 'destructive',
			});
		},
		onClientUploadComplete: (data) => {
			if (!data) {
				setUploadError(true);
				toast({
					title: m('ERRORS.WORKSPACE_ICON_ADDED'),
					variant: 'destructive',
				});
			}
		},
	});

	const { mutate: newWorkspace, isLoading } = useMutation({
		mutationFn: async (data: ApiWorkspaceSchema) => {
			const { data: result } = await axios.post('/api/workspace/new', data);
			return result;
		},
		onError: (err: AxiosError) => {
			const error = err?.response?.data ? err.response.data : 'ERRORS.DEFAULT';

			toast({
				title: m(error),
				variant: 'destructive',
			});
		},
		onSuccess: () => {
			onSetOpen(false);
			toast({
				title: m('SUCCES.NEW_WORKSAPCE'),
			});
			router.refresh();
		},
		mutationKey: ['newWorkspace'],
	});

	const onSubmit = async (data: WorkspaceSchema) => {
		setUploadError(false);

		const image: File | undefined | null = data.file;

		let workspaceImageURL: null | string = null;
		if (image) {
			const data = await startUpload([image]);
			if (data) workspaceImageURL = data[0].url;
		}
		if (uplaodError) return;

		newWorkspace({
			workspaceName: data.workspaceName,
			file: workspaceImageURL,
		});
	};

	return (
		<Form {...form}>
			<form className='w-full space-y-8 ' onSubmit={form.handleSubmit(onSubmit)}>
				<div className='space-y-1.5'>
					<FormField
						control={form.control}
						name='workspaceName'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-muted-foreground'>{t('INPUTS.NAME')}</FormLabel>
								<FormControl>
									<Input className='bg-muted' placeholder={t('PLACEHOLDERS.NAME')} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<UploadFile
					ContainerClassName='w-full'
					LabelClassName='text-muted-foreground mb-1.5 self-start'
					LabelText={t('INPUTS.FILE')}
					form={form}
					schema={workspaceSchema}
					inputAccept='image/*'
					typesDescription={t('IMAGE')}
				/>
				<Button
					disabled={!form.formState.isValid || isUploading || isLoading}
					type='submit'
					className='mt-10 w-full  dark:text-white font-semibold '>
					{isUploading || isLoading ? (
						<LoadingState loadingText={t('BTN_PENDING')} />
					) : (
						t('BTN_ADD')
					)}
				</Button>
			</form>
		</Form>
	);
};
