'use client';
import React, { useMemo, useState } from 'react';
import { SettingsWorkspace } from '@/types/extended';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { CustomColors } from '@prisma/client';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Check, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UploadFile } from '@/components/common/UploadFile';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { WorkspacePicture, workspacePicture } from '@/schema/workspaceSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import axios, { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next-intl/client';
import { useUploadThing } from '@/lib/uploadthing';
import { LoadingState } from '@/components/ui/loading-state';

interface Props {
	workspace: SettingsWorkspace;
}

export const EditWorkspaceImage = ({ workspace: { id, color, image, name } }: Props) => {
	const [imagePreview, setImagePreview] = useState<string>('');
	const [open, setOpen] = useState(false);

	const t = useTranslations('EDIT_WORKSPACE.PICTURE');
	const m = useTranslations('MESSAGES');

	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<WorkspacePicture>({
		resolver: zodResolver(workspacePicture),
	});

	const workspaceColor = useMemo(() => {
		switch (color) {
			case CustomColors.PURPLE:
				return 'bg-purple-600 hover:bg-purple-500';

			case CustomColors.GREEN:
				return 'bg-green-600 hover:bg-green-500';

			case CustomColors.RED:
				return 'bg-red-600 hover:bg-red-500';

			case CustomColors.BLUE:
				return 'bg-blue-600 hover:bg-blue-500';

			case CustomColors.CYAN:
				return 'bg-cyan-600 hover:bg-cyan-500';

			case CustomColors.EMERALD:
				return 'bg-emerald-600 hover:bg-emerald-500';

			case CustomColors.INDIGO:
				return 'bg-indigo-600 hover:bg-indigo-500';

			case CustomColors.LIME:
				return 'bg-lime-600 hover:bg-lime-500';

			case CustomColors.ORANGE:
				return 'bg-orange-600 hover:bg-orange-500';
			case CustomColors.FUCHSIA:
				return 'bg-fuchsia-600 hover:bg-fuchsia-500';

			case CustomColors.PINK:
				return 'bg-pink-600 hover:bg-pink-500';

			case CustomColors.YELLOW:
				return 'bg-yellow-600 hover:bg-yellow-500';

			default:
				return 'bg-green-600 hover:bg-green-500';
		}
	}, [color]);

	const imageOptions = useMemo(() => {
		if (!imagePreview && image) {
			return {
				canDelete: true,
				canSave: false,
			};
		} else if (imagePreview && image) {
			return {
				canDelete: false,
				canSave: true,
			};
		} else if (imagePreview && !image) {
			return {
				canDelete: false,
				canSave: true,
			};
		} else {
			return {
				canDelete: false,
				canSave: false,
			};
		}
	}, [imagePreview, image]);

	const { startUpload, isUploading } = useUploadThing('imageUploader', {
		onUploadError: () => {
			toast({
				title: m('ERRORS.WORKSPACE_ICON_ADDED'),
				variant: 'destructive',
			});
		},
		onClientUploadComplete: (data) => {
			if (!data) {
				toast({
					title: m('ERRORS.WORKSPACE_ICON_ADDED'),
					variant: 'destructive',
				});
			} else {
				updateWorkspacePicture(data[0].url);
			}
		},
	});

	const { mutate: deleteWorkspacePicture, isLoading: isDeleting } = useMutation({
		mutationFn: async () => {
			await axios.post('/api/workspace/delete/picture', { id });
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
				title: m('SUCCES.WORKSPACE_PICTURE_DELETED'),
			});

			router.refresh();
		},
		mutationKey: ['deleteWorkspacePicture'],
	});

	const { mutate: updateWorkspacePicture, isLoading } = useMutation({
		mutationFn: async (picture: string) => {
			const { data: result } = await axios.post('/api/workspace/edit/picture', {
				id,
				picture,
			});
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
			toast({
				title: m('SUCCES.WORKSPACE_PICTURE_UPDATED'),
			});
			router.refresh();
		},
		mutationKey: ['changeWorkspacePicture'],
	});

	const onSetImagePreviewHandler = (image: string) => {
		setImagePreview(image);
	};
	const onSubmit = async (data: WorkspacePicture) => {
		const image: File = data.file;
		await startUpload([image]);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<div className='flex flex-col space-y-1.5 justify-start'>
				<Label className='text-muted-foreground'>{t('LABEL')}</Label>
				<DialogTrigger asChild>
					<Button
						onClick={() => {
							form.clearErrors('file');
							setImagePreview('');
						}}
						className={cn(` w-16 h-16 text-white text-2xl font-bold  ${!image && workspaceColor}`)}
						variant={image ? 'ghost' : 'default'}
						size={'icon'}>
						{image ? (
							<Image
								className='w-16 h-16 rounded-md object-cover'
								width={450}
								height={450}
								alt='workspace image'
								src={image}
							/>
						) : (
							name[0].toUpperCase()
						)}
					</Button>
				</DialogTrigger>
			</div>
			<DialogContent className='sm:max-w-[28rem]  flex flex-col justify-center items-center p-8'>
				<DialogHeader className='items-center justify-center'>
					<DialogTitle>{t('TITLE')}</DialogTitle>
				</DialogHeader>
				<div
					className={`w-32 h-32 sm:w-40 sm:h-40 text-5xl text-white font-bold rounded-lg flex justify-center items-center my-5  ${
						!imagePreview && !image && workspaceColor
					} pointer-events-none`}>
					{imagePreview ? (
						<Image
							className='w-32 h-32 sm:w-40 sm:h-40 rounded-md object-cover'
							width={450}
							height={450}
							alt='workspace image'
							src={imagePreview}
						/>
					) : image ? (
						<Image
							className='w-32 h-32 sm:w-40 sm:h-40 rounded-md object-cover'
							width={450}
							height={450}
							alt='workspace image'
							src={image}
						/>
					) : (
						<p>{name[0].toUpperCase()}</p>
					)}
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<UploadFile
							onGetImagePreview={onSetImagePreviewHandler}
							hideFileName
							useAsBtn
							btnText={t('BTN')}
							ContainerClassName='w-full'
							form={form}
							schema={workspacePicture}
							inputAccept='image/*'
						/>

						<div className='mt-5 w-full flex justify-center items-center gap-4'>
							<Button
								onClick={() => {
									deleteWorkspacePicture();
								}}
								type='button'
								disabled={!imageOptions.canDelete || isDeleting}
								variant={imageOptions.canDelete ? 'default' : 'secondary'}
								className={`rounded-full w-12 h-12 p-2  ${
									imageOptions.canDelete ? 'text-white' : 'text-muted-foreground'
								}`}>
								{isDeleting ? <LoadingState /> : <Trash size={18} />}
							</Button>
							<Button
								type='submit'
								disabled={!imageOptions.canSave || isUploading || isLoading}
								variant={imageOptions.canSave ? 'default' : 'secondary'}
								className={`rounded-full w-12 h-12 p-2 ${
									imageOptions.canSave ? 'text-white' : 'text-muted-foreground'
								} `}>
								{isUploading || isLoading ? <LoadingState /> : <Check size={18} />}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
