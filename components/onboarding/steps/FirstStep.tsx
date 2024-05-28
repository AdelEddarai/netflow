'use client';

import { Input } from '@/components/ui/input';
import { useOnboardingForm } from '@/context/OnboardingForm';
import { ArrowRight, User } from 'lucide-react';
import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AditionalUserInfoFirstPart, aditionalUserInfoFirstPart } from '@/schema/aditionalUserInfo';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { ActionType } from '@/types/onBoardingContext';
import { Button } from '@/components/ui/button';
import { AddUserImage } from '../../common/AddUserImage';
import { useTranslations } from 'next-intl';

interface Props {
	profileImage?: string | null;
}

export const FirstStep = ({ profileImage }: Props) => {
	const t = useTranslations('ONBOARDING_FORM');
	const { name, surname, currentStep, dispatch } = useOnboardingForm();

	const form = useForm<AditionalUserInfoFirstPart>({
		resolver: zodResolver(aditionalUserInfoFirstPart),
		defaultValues: {
			name: name ? name : '',
			surname: surname ? surname : '',
		},
	});

	useEffect(() => {
		dispatch({ type: ActionType.PROFILEIMAGE, payload: profileImage as string | null | undefined });
	}, [profileImage, dispatch]);

	const onSubmit = (data: AditionalUserInfoFirstPart) => {
		dispatch({ type: ActionType.NAME, payload: data.name });
		dispatch({ type: ActionType.SURNAME, payload: data.surname });
		dispatch({ type: ActionType.CHNAGE_SITE, payload: currentStep + 1 });
	};

	return (
		<>
			<h2 className='font-bold  text-4xl md:text-5xl flex flex-col items-center my-10'>
				<span>{t('FIRST_STEP.TITLE.FIRST')}</span>
				<span>{t('FIRST_STEP.TITLE.SECOND')}</span>
			</h2>

			<div className='max-w-md w-full space-y-8 '>
				<div className='w-full flex flex-col justify-center items-center gap-2'>
					<p className='text-sm text-muted-foreground'>{t('FIRST_STEP.PHOTO')}</p>
					<AddUserImage profileImage={profileImage} />
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
						<div className='space-y-1.5'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-muted-foreground'>
											{t('FIRST_STEP.INPUTS.NAME')}
										</FormLabel>
										<FormControl
											onChange={() => {
												dispatch({ type: ActionType.NAME, payload: form.getValues('name') });
											}}>
											<Input
												className='bg-muted'
												placeholder={t('FIRST_STEP.PLACEHOLDERS.NAME')}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='surname'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-muted-foreground'>
											{t('FIRST_STEP.INPUTS.SURNAME')}
										</FormLabel>
										<FormControl
											onChange={() => {
												dispatch({ type: ActionType.SURNAME, payload: form.getValues('surname') });
											}}>
											<Input
												className='bg-muted'
												placeholder={t('FIRST_STEP.PLACEHOLDERS.SURNAME')}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button type='submit' className='mt-10 w-full max-w-md dark:text-white font-semibold '>
							{t('NEXT_BTN')}
							<ArrowRight className='ml-2' width={18} height={18} />
						</Button>
					</form>
				</Form>
			</div>
		</>
	);
};
