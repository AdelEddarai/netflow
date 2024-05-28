'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { imageLinkSchema, ImageLinkSchema } from '@/schema/linkSchema';
import { LoadingState } from '@/components/ui/loading-state';
import { UploadFile } from '@/components/common/UploadFile';
import { useUploadThing } from '@/lib/uploadthing';

interface Props {
	onAddImage: (link: string) => void;
}

export const AddImageByImport = ({ onAddImage }: Props) => {
	const t = useTranslations('TASK.EDITOR.IMAGE.UPLOAD_TAB');
	const m = useTranslations('MESSAGES');

	const { toast } = useToast();

	const form = useForm<ImageLinkSchema>({
		resolver: zodResolver(imageLinkSchema),
	});

	const { startUpload, isUploading } = useUploadThing('imageUploader', {
		onUploadError: () => {
			toast({
				title: m('ERRORS.IMAGE_TO_EDITOR'),
				variant: 'destructive',
			});
		},
		onClientUploadComplete: (data) => {
			if (!data) {
				toast({
					title: m('ERRORS.IMAGE_TO_EDITOR'),
					variant: 'destructive',
				});
			} else {
				onAddImage(data[0].url);
			}
		},
	});


	const addImageByImportHandler = async (data: ImageLinkSchema) => {
		const image: File = data.file;
		await startUpload([image]);
	};
	return (
		<Form {...form}>
			<form className='space-y-6 my-6'>
				<UploadFile
					ContainerClassName='w-full'
					LabelClassName='text-muted-foreground mb-1.5 self-start'
					typesDescription={t('TYPES')}
					form={form}
					schema={imageLinkSchema}
					inputAccept='image/*'
				/>

				<div className='flex justify-end w-full items-center gap-2'>
					<Button
						disabled={!form.formState.isValid || isUploading}
						className='text-white'
						onClick={() => {
							form.handleSubmit(addImageByImportHandler)();
						}}
						type='button'>
						{isUploading ? <LoadingState loadingText={t('BTN_PENDING')} /> : t('BTN_ADD')}
					</Button>
				</div>
			</form>
		</Form>
	);
};
