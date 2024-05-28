'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { linkSchema, LinkSchema } from '@/schema/linkSchema';
import { LoadingState } from '@/components/ui/loading-state';

interface Props {
	onAddImage: (link: string) => void;
}

export const AddImageByLink = ({ onAddImage }: Props) => {
	const [isLoading, setIsLoading] = useState(false);

	const t = useTranslations('TASK.EDITOR.IMAGE.LINK_TAB');

	const form = useForm<LinkSchema>({
		resolver: zodResolver(linkSchema),
		defaultValues: {
			link: '',
		},
	});

	const isImage = async (url: string) => {
		try {
			const data = await fetch(url, { method: 'HEAD' });
			if (!data.ok) return false;
			const res = data.headers.get('Content-Type')?.startsWith('image');
			if (res) return true;
			return false;
		} catch (_) {
			return false;
		}
	};

	const addImageByLinkHandler = async (data: LinkSchema) => {
		setIsLoading(true);
		try {
			const { link } = data;

			const isValidLink = await isImage(link);
			if (!isValidLink) {
				form.setError('link', {
					message: 'ERRORS.WRONG_IMAGE_LINK',
				});
				setIsLoading(false);
				return;
			}
			onAddImage(link);
		} catch (_) {}
		setIsLoading(false);
	};

	return (
		<Form {...form}>
			<form className='space-y-6 my-6'>
				<div className='space-y-1.5'>
					<FormField
						control={form.control}
						name='link'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input className='bg-muted' placeholder={t('PLACEHOLDER')} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className='flex justify-end w-full items-center gap-2'>
					<Button
						disabled={!form.formState.isValid || isLoading}
						className='text-white'
						onClick={() => {
							form.handleSubmit(addImageByLinkHandler)();
						}}
						type='button'>
						{isLoading ? <LoadingState loadingText={t('BTN_PENDING')} /> : t('BTN_ADD')}
					</Button>
				</div>
			</form>
		</Form>
	);
};
