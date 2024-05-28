'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { useOnboardingForm } from '@/context/OnboardingForm';
import { useTranslations } from 'next-intl';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next-intl/client';
import { useSession } from 'next-auth/react';
export const Finish = () => {
	const { workspaceName, workspaceImage, surname, useCase, name } = useOnboardingForm();
	const [isDone, setIsDone] = useState(false);

	const { update } = useSession();
	const router = useRouter();

	const { toast } = useToast();

	const t = useTranslations('ONBOARDING_FORM');
	const m = useTranslations('MESSAGES');

	const { mutate: completeOnboarding, isLoading } = useMutation({
		mutationFn: async () => {
			const { data } = await axios.post('/api/onboarding', {
				name,
				surname,
				useCase,
				workspaceImage,
				workspaceName,
			});
			return data;
		},
		onError: (err: AxiosError) => {
			const error = err?.response?.data ? err.response.data : 'ERRORS.DEFAULT';

			toast({
				title: m(error),
				variant: 'destructive',
			});
		},
		onSuccess: async () => {
			setIsDone(true);
			toast({
				title: m('SUCCES.ONBOARDING_COMPLETE'),
			});
			await update();
			router.push('/dashboard');
			router.refresh();
		},
		mutationKey: ['completeOnboarding'],
	});

	return (
		<>
			<div className='flex flex-col  justify-center items-center gap-4 w-full my-10 text-center'>
				<h2 className='font-bold  text-4xl md:text-5xl  max-w-md'>{t('FINISH.TITLE')}</h2>
			</div>
			<div className='font-bold  text-xl sm:text-2xl md:text-3xl w-full max-w-lg  text-center'>
				<p>
					{t('FINISH.DESC_FIRST')}{' '}
					<span>
						Study<span className='text-primary font-semibold'>Flow</span>
					</span>
					{t('FINISH.DESC_SECOND')}
				</p>
				<Button
					disabled={isLoading || isDone}
					onClick={() => completeOnboarding()}
					type='submit'
					className='mt-10 sm:mt-32 w-full max-w-md dark:text-white font-semibold '>
					{isLoading || isDone ? (
						<LoadingState loadingText={isDone ? t('IS_DONE') : ''} />
					) : (
						<>{t('START_BTN')}</>
					)}
				</Button>
			</div>
		</>
	);
};
