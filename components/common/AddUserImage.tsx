'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Camera, Check, Trash, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/user-avatar';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { ImageSchema, imageSchema } from '@/schema/imageSchema';
import { useUploadThing } from '@/lib/uploadthing';
import { LoadingState } from '../ui/loading-state';
import { useSession } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next-intl/client';
import { User as UserType } from '@prisma/client';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import axios, { AxiosError } from 'axios';

interface Props {
	profileImage?: string | null;
	className?: string;
}

export const AddUserImage = ({ profileImage, className }: Props) => {
	const [open, setOpen] = useState(false);
	const [imagePreview, setImagePreview] = useState('');
	const t = useTranslations('CHANGE_PROFILE_IMAGE');
	const m = useTranslations('MESSAGES');
	const inputRef = useRef<null | HTMLInputElement>(null);

	const router = useRouter();
	const { toast } = useToast();
	const { update } = useSession();

	const form = useForm<ImageSchema>({
		resolver: zodResolver(imageSchema),
	});

	const imageOptions = useMemo(() => {
		if (!imagePreview && profileImage) {
			return {
				canDelete: true,
				canSave: false,
			};
		} else if (imagePreview && profileImage) {
			return {
				canDelete: false,
				canSave: true,
			};
		} else if (imagePreview && !profileImage) {
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
	}, [imagePreview, profileImage]);

	const { mutate: updateProfileImage, isLoading } = useMutation({
		mutationFn: async (profileImage: string) => {
			const { data } = await axios.post('/api/profile/change_profile_image', { profileImage });

			return data as UserType;
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
				title: m('SUCCES.IMAGE_PROFILE_UPDATE'),
			});
			setOpen(false);
			await update();
			router.refresh();
		},
		mutationKey: ['upadteProfileImage'],
	});

	const { mutate: delteProfileImage, isLoading: isDeleting } = useMutation({
		mutationFn: async () => {
			const { data } = await axios.post('/api/profile/delete_profile_image');
			return data as UserType;
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
				title: m('SUCCES.IMAGE_PROFILE_DELETE'),
			});
			await update();
			router.refresh();
		},
		mutationKey: ['deleteProfileImage'],
	});

	const { startUpload, isUploading } = useUploadThing('imageUploader', {
		onUploadError: () => {
			toast({
				title: m('ERRORS.UPLOAD_FAILE'),
				variant: 'destructive',
			});
		},
		onClientUploadComplete: (data) => {
			if (data) updateProfileImage(data[0].url);
			else
				toast({
					title: m('ERRORS.IMAGE_PROFILE_UPDATE'),
					variant: 'destructive',
				});
		},
	});

	const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const selectedFile = e.target.files[0];
			const result = imageSchema.safeParse({ image: selectedFile });

			if (result.success) {
				form.clearErrors('image');
				form.setValue('image', selectedFile);
				setImagePreview(URL.createObjectURL(e.target.files[0]));
			} else {
				const errors = result.error.flatten().fieldErrors.image;
				errors?.forEach((error) =>
					form.setError('image', {
						message: error,
					})
				);
			}
		}
	};

	const onSubmit = async (data: ImageSchema) => {
		const image: File = data.image;
		await startUpload([image]);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					onClick={() => {
						setImagePreview('');
					}}
					variant={'secondary'}
					className={cn(
						'bg-muted w-16 md:h-20 md:w-20 h-16 rounded-full flex justify-center items-center text-muted-foreground relative overflow-hidden group',
						className
					)}>
					{profileImage ? (
						<Image
							priority
							src={profileImage}
							alt='profile image'
							fill
							className='object-cover w-full h-full '
						/>
					) : (
						<User />
					)}
					<div className='group-hover:opacity-80 transition-opacity  duration-200 opacity-0 w-full h-full absolute  bg-black flex justify-center items-center flex-col gap-1 text-xs text-white'>
						<Camera size={20} />
						<p>{t('HOVER')}</p>
					</div>
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[28rem] flex flex-col justify-center items-center p-8'>
				<DialogHeader className='items-center justify-center'>
					<DialogTitle>{t('TITLE')}</DialogTitle>
				</DialogHeader>
				{imagePreview ? (
					<div className='rounded-full w-32 h-32 sm:w-52 sm:h-52  relative overflow-hidden my-5'>
						<Image
							src={imagePreview}
							alt='profile image'
							fill
							className='object-cover w-full h-full '
						/>
					</div>
				) : (
					<UserAvatar
						className=' w-32 h-32 sm:w-52 sm:h-52 my-5'
						size={52}
						profileImage={profileImage}
					/>
				)}

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name='image'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div className='flex justify-center items-center'>
											<Button
												onClick={() => {
													inputRef.current?.click();
												}}
												type='button'
												className='dark:text-white mb-1'>
												{t('BUTTON')}
											</Button>
											<Input
												{...field}
												value={undefined}
												onChange={onImageChange}
												ref={inputRef}
												type='file'
												id='image'
												className='hidden'
												accept='image/*'
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className='mt-5 w-full flex justify-center items-center gap-4'>
							<Button
								onClick={() => {
									delteProfileImage();
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
