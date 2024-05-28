'use client';

import React from 'react';
import { tagSchema, TagSchema } from '@/schema/tagSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import {
	Form,
	FormField,
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useTranslations } from 'next-intl';
import { colors } from '@/lib/getRandomWorkspaceColor';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CustomColors, Tag } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

interface Props {
	workspaceId: string;
	edit?: boolean;
	tagName?: string;
	color?: CustomColors;
	currentActiveTags?: Tag[];
	id?: string;
	onSetTab: (tab: 'list' | 'newTag' | 'editTag') => void;
	onUpdateActiveTags?: (tagId: string, color: CustomColors, name: string) => void;
	onDeleteActiveTag?: (tagId: string) => void;
	onSelectActiveTag?: (id: string) => void;
}

export const CreateNewTagOrEditTag = ({
	workspaceId,
	edit,
	color,
	id,
	tagName,
	currentActiveTags,
	onSetTab,
	onUpdateActiveTags,
	onDeleteActiveTag,
	onSelectActiveTag,
}: Props) => {
	const { toast } = useToast();
	const queryClient = useQueryClient();

	const t = useTranslations('COMMON.TAG');
	const m = useTranslations('MESSAGES');

	const form = useForm<TagSchema>({
		resolver: zodResolver(tagSchema),
		defaultValues: {
			tagName: edit && tagName ? tagName : '',
			color: edit && color ? color : 'PURPLE',
			id: edit && id ? id : uuidv4(),
		},
	});

	const tagColor = (providedColor: CustomColors) => {
		switch (providedColor) {
			case CustomColors.PURPLE:
				return 'bg-purple-600 border-purple-600 hover:bg-purple-500 hover:border-purple-500';

			case CustomColors.GREEN:
				return 'bg-green-600 border-green-600 hover:bg-green-500 hover:border-green-500';

			case CustomColors.RED:
				return 'bg-red-600 border-red-600 hover:bg-red-500 hover:border-red-500';

			case CustomColors.BLUE:
				return 'bg-blue-600 border-blue-600 hover:bg-blue-500 hover:border-blue-500';

			case CustomColors.CYAN:
				return 'bg-cyan-600 border-cyan-600 hover:bg-cyan-500 hover:border-cyan-500';

			case CustomColors.EMERALD:
				return 'bg-emerald-600 border-emerald-600 hover:bg-emerald-500 hover:border-emerald-500';

			case CustomColors.INDIGO:
				return 'bg-indigo-600 border-indigo-600 hover:bg-indigo-500 hover:border-indigo-500';

			case CustomColors.LIME:
				return 'bg-lime-600 border-lime-600 hover:bg-lime-500 hover:border-lime-500';

			case CustomColors.ORANGE:
				return 'bg-orange-600 border-orange-600 hover:bg-orange-500 hover:border-orange-500';
			case CustomColors.FUCHSIA:
				return 'bg-fuchsia-600 border-fuchsia-600 hover:bg-fuchsia-500 hover:border-fuchsia-500';

			case CustomColors.PINK:
				return 'bg-pink-600 border-pink-600 hover:bg-pink-500 hover:border-pink-500';

			case CustomColors.YELLOW:
				return 'bg-yellow-600 border-yellow-600 hover:bg-yellow-500 hover:border-yellow-500';

			default:
				return 'bg-green-600 border-green-600 hover:bg-green-500 hover:border-green-500';
		}
	};

	const { mutate: newTag } = useMutation({
		mutationFn: async (data: TagSchema) => {
			await axios.post('/api/tags/new_tag', {
				...data,
				workspaceId,
			});
		},
		onMutate: async () => {
			await queryClient.cancelQueries(['getWorkspaceTags']);
			const previousTags = queryClient.getQueryData<Tag[]>(['getWorkspaceTags']);

			const checkedPreviousTags = previousTags && previousTags.length > 0 ? previousTags : [];

			const id = form.getValues('id');
			const name = form.getValues('tagName');
			const color = form.getValues('color');

			queryClient.setQueryData(
				['getWorkspaceTags'],
				[...checkedPreviousTags, { id, name, color, workspaceId }]
			);
			onSetTab('list');

			return { checkedPreviousTags };
		},
		onError: (err: AxiosError, _, context) => {
			queryClient.setQueryData(['getWorkspaceTags'], context?.checkedPreviousTags);
			const error = err?.response?.data ? err.response.data : 'ERRORS.DEFAULT';

			toast({
				title: m(error),
				variant: 'destructive',
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries(['getWorkspaceTags']);
		},

		mutationKey: ['newTag'],
	});

	const { mutate: editTag } = useMutation({
		mutationFn: async (data: TagSchema) => {
			await axios.post('/api/tags/edit_tag', {
				...data,
				workspaceId,
			});
		},
		onMutate: async () => {
			await queryClient.cancelQueries(['getWorkspaceTags']);
			const previousTags = queryClient.getQueryData<Tag[]>(['getWorkspaceTags']);

			const checkedPreviousTags = previousTags && previousTags.length > 0 ? previousTags : [];

			const name = form.getValues('tagName');
			const color = form.getValues('color');

			const updatedTags = checkedPreviousTags.map((tag) =>
				tag.id === id ? { ...tag, name, color } : tag
			);

			queryClient.setQueryData(['getWorkspaceTags'], updatedTags);
			onUpdateActiveTags && onUpdateActiveTags(id!, color, name);
			onSetTab('list');

			return { checkedPreviousTags };
		},
		onError: (err: AxiosError, _, context) => {
			const prevTag = context?.checkedPreviousTags.find((tag) => tag.id === id);
			queryClient.setQueryData(['getWorkspaceTags'], context?.checkedPreviousTags);
			onUpdateActiveTags && onUpdateActiveTags(id!, prevTag?.color!, prevTag?.name!);
			const error = err?.response?.data ? err.response.data : 'ERRORS.DEFAULT';

			toast({
				title: m(error),
				variant: 'destructive',
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries(['getWorkspaceTags']);
		},

		mutationKey: ['editTag'],
	});

	const { mutate: deleteTag } = useMutation({
		mutationFn: async () => {
			await axios.post('/api/tags/delete_tag', {
				id,
				workspaceId,
			});
		},
		onMutate: async () => {
			await queryClient.cancelQueries(['getWorkspaceTags']);
			const previousTags = queryClient.getQueryData<Tag[]>(['getWorkspaceTags']);

			const checkedPreviousTags = previousTags && previousTags.length > 0 ? previousTags : [];
			const prevoiusActiveTags = currentActiveTags ? currentActiveTags : [];

			const updatedTags = checkedPreviousTags.filter((tag) => tag.id !== id);

			queryClient.setQueryData(['getWorkspaceTags'], updatedTags);

			onDeleteActiveTag && onDeleteActiveTag(id!);
			onSetTab('list');

			return { checkedPreviousTags, prevoiusActiveTags };
		},
		onError: (err: AxiosError, _, context) => {
			const prevActiveTag = context?.prevoiusActiveTags.find((tag) => tag.id === id);

			queryClient.setQueryData(['getWorkspaceTags'], context?.checkedPreviousTags);

			prevActiveTag && onSelectActiveTag && onSelectActiveTag(prevActiveTag.id);

			const error = err?.response?.data ? err.response.data : 'ERRORS.DEFAULT';

			toast({
				title: m(error),
				variant: 'destructive',
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries(['getWorkspaceTags']);
		},

		mutationKey: ['deleteTag'],
	});

	const onSubmit = async (data: TagSchema) => {
		edit ? editTag(data) : newTag(data);
	};

	return (
		<Form {...form}>
			<form className='w-full max-w-[15rem] p-3  space-y-6'>
				<div className='space-y-4 '>
					<div className='space-y-1.5'>
						<FormField
							control={form.control}
							name='tagName'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											className='bg-muted h-7 py-1.5 text-sm'
											placeholder={t('TAG_NAME')}
											{...field}
										/>
									</FormControl>
									<FormMessage className='text-xs' />
								</FormItem>
							)}
						/>
					</div>
					<div className='space-y-1.5'>
						<FormField
							control={form.control}
							name='color'
							render={({ field }) => (
								<FormItem className='space-y-1.5'>
									<FormLabel className='text-muted-foreground'>{t('COLORS')}</FormLabel>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className='flex flex-wrap gap-3'>
											{colors.map((color) => (
												<FormItem
													key={color}
													className='flex items-center justify-center space-x-4 space-y-0'>
													<FormControl>
														<RadioGroupItem
															useCheckIcon
															className={`transition-colors duration-200  ${tagColor(color)}`}
															value={color}
														/>
													</FormControl>
												</FormItem>
											))}
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className='flex gap-2'>
					<Button
						onClick={() => {
							edit ? deleteTag() : onSetTab('list');
						}}
						type='button'
						className='w-1/2 h-fit py-1.5'
						variant={'secondary'}
						size={'sm'}>
						{edit ? t('BTNS.DELETE') : t('BTNS.CANCEL')}
					</Button>
					<Button
						onClick={form.handleSubmit(onSubmit)}
						size={'sm'}
						type='button'
						className='w-1/2 h-fit py-1.5 dark:text-white '>
						{edit ? t('BTNS.UPDATE') : t('BTNS.CREATE')}
					</Button>
				</div>
			</form>
		</Form>
	);
};
