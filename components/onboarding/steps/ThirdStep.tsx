'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Form,
	FormField,
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { WorkspaceSchema, workspaceSchema } from '@/schema/workspaceSchema';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { UploadFile } from '@/components/common/UploadFile';
import { useUploadThing } from '@/lib/uploadthing';
import { useTranslations } from 'next-intl';
import { useToast } from '@/components/ui/use-toast';
import { LoadingState } from '@/components/ui/loading-state';
import { useOnboardingForm } from '@/context/OnboardingForm';
import { ActionType } from '@/types/onBoardingContext';
import { useState } from 'react';

export const ThirdStep = () => {
	const { currentStep, dispatch } = useOnboardingForm();
	const [uplaodError, setUploadError] = useState(false);

	const m = useTranslations('MESSAGES');
	const t = useTranslations('ONBOARDING_FORM');

	const { toast } = useToast();
	
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
			if (data) {
				dispatch({ type: ActionType.WORKSPACE_IMAGE, payload: data[0].url });
			} else {
				setUploadError(true);
				toast({
					title: m('ERRORS.WORKSPACE_ICON_ADDED'),
					variant: 'destructive',
				});
			}
		},
	});

	const onSubmit = async (data: WorkspaceSchema) => {
		setUploadError(false);

		const image: File | undefined | null = data.file;

		if (image) {
			await startUpload([image]);
		}
		if (uplaodError) return;
		dispatch({ type: ActionType.WORKSPACE_NAME, payload: data.workspaceName });
		dispatch({ type: ActionType.CHNAGE_SITE, payload: currentStep + 1 });
	};

	return (
		<>
			<div className='flex flex-col  justify-center items-center gap-4 w-full my-10 text-center'>
				<h2 className='font-bold  text-4xl md:text-5xl  max-w-md'>{t('THIRD_STEP.TITLE')}</h2>
			</div>

			<Form {...form}>
				<form className='max-w-md w-full space-y-8 mt-10 ' onSubmit={form.handleSubmit(onSubmit)}>
					<div className='space-y-1.5'>
						<FormField
							control={form.control}
							name='workspaceName'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-muted-foreground'>
										{t('THIRD_STEP.INPUTS.NAME')}
									</FormLabel>
									<FormControl>
										<Input
											className='bg-muted'
											placeholder={t('THIRD_STEP.PLACEHOLDERS.NAME')}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<UploadFile
						ContainerClassName='w-full'
						LabelClassName='text-muted-foreground mb-1.5 self-start'
						LabelText={t('THIRD_STEP.INPUTS.FILE')}
						form={form}
						schema={workspaceSchema}
						inputAccept='image/*'
						typesDescription={t('THIRD_STEP.IMAGE')}
					/>
					<Button
						disabled={!form.formState.isValid || isUploading}
						type='submit'
						className='mt-10 w-full max-w-md dark:text-white font-semibold '>
						{isUploading ? (
							<LoadingState />
						) : (
							<>
								{t('NEXT_BTN')}
								<ArrowRight className='ml-2' width={18} height={18} />
							</>
						)}
					</Button>
				</form>
			</Form>
		</>
	);
};
