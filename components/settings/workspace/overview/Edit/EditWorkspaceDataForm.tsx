'use client';

import React from 'react';
import { WorkspaceEditData, workspaceEditData } from '@/schema/workspaceSchema';
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useTranslations } from 'next-intl';
import { LoadingState } from '@/components/ui/loading-state';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next-intl/client';
import { SettingsWorkspace } from '@/types/extended';
import Warning from '@/components/ui/warning';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { colors } from '@/lib/getRandomWorkspaceColor';
import { CustomColors } from '@prisma/client';

interface Props {
	workspace: SettingsWorkspace;
}

export const EditWorkspaceDataForm = ({ workspace: { id, name, image, color } }: Props) => {
	const { toast } = useToast();

	const t = useTranslations('EDIT_WORKSPACE.DATA');
	const m = useTranslations('MESSAGES');

	const router = useRouter();

	const form = useForm<WorkspaceEditData>({
		resolver: zodResolver(workspaceEditData),
		defaultValues: {
			workspaceName: name,
			color,
		},
	});

	const workspaceColor = (providedColor: CustomColors) => {
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

	const { mutate: editWorkspaceData, isLoading } = useMutation({
		mutationFn: async (data: WorkspaceEditData) => {
			await axios.post('/api/workspace/edit/data', { ...data, id });
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
				title: m('SUCCES.UPDATED_WORKSAPCE'),
			});
			router.refresh();
			form.reset();
		},
		mutationKey: ['editWorkspaceData'],
	});

	const onSubmit = async (data: WorkspaceEditData) => {
		editWorkspaceData(data);
	};
	return (
		<Form {...form}>
			<form
				className='w-full max-w-md mt-0 sm:mt-0 space-y-6'
				onSubmit={form.handleSubmit(onSubmit)}>
				<div className='space-y-2 sm:space-y-4'>
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
					<div className='space-y-1.5'>
						<FormField
							control={form.control}
							name='color'
							render={({ field }) => (
								<FormItem className='space-y-1.5'>
									<FormLabel className='text-muted-foreground'>{t('INPUTS.COLOR')}</FormLabel>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className='flex flex-wrap  gap-2 md:gap-3'>
											{colors.map((color) => (
												<FormItem key={color} className='flex items-center space-x-3 space-y-0'>
													<FormControl>
														<RadioGroupItem
															useCheckIcon
															className={`transition-colors duration-200 ${workspaceColor(color)}`}
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
				<Warning blue>
					<p>{t('INFO')}</p>
				</Warning>
				<Button
					disabled={!form.formState.isValid || isLoading}
					type='submit'
					className='mt-10   dark:text-white font-semibold '>
					{isLoading ? <LoadingState loadingText={t('BTN_PENDING')} /> : t('BTN')}
				</Button>
			</form>
		</Form>
	);
};
