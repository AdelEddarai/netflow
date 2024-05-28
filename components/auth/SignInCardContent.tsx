'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { SignInSchema, signInSchema } from '@/schema/signInSchema';
import { CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { ProviderSigInBtns } from './ProviderSigInBtns';
import { useRouter } from 'next-intl/client';
import { signIn } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { LoadingState } from '@/components/ui/loading-state';
import { Button } from '@/components/ui/button';

export const SignInCardContent = () => {
	const t = useTranslations('AUTH');
	const m = useTranslations('MESSAGES');
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<SignInSchema>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async (data: SignInSchema) => {
		setIsLoading(true);
		try {
			const account = await signIn('credentials', {
				email: data.email,
				password: data.password,
				redirect: false,
			});
			if (!account) throw new Error('ERRORS.DEFAULT');

			if (account.error)
				toast({
					title: m(account.error),
					variant: 'destructive',
				});
			else {
				toast({
					title: m('SUCCES.SIGN_IN'),
				});
				router.push(`/onboarding`);
				router.refresh();
			}
		} catch (err) {
			let errMsg = m('ERRORS.DEFAULT');
			if (typeof err === 'string') {
				errMsg = err;
			} else if (err instanceof Error) {
				errMsg = m(err.message);
			}
			toast({
				title: errMsg,
				variant: 'destructive',
			});
		}
		setIsLoading(false);
	};

	return (
		<CardContent>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-7'>
					<ProviderSigInBtns signInCard onLoading={setIsLoading} />
					<div className='space-y-1.5'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input placeholder={t('EMAIL')} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input placeholder={t('PASSWORD')} type='password' {...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Button disabled={isLoading} className='w-full font-bold text-white ' type='submit'>
						{isLoading ? (
							<LoadingState loadingText={m('PENDING.LOADING')} />
						) : (
							t('SIGN_IN.SUBMIT_BTN')
						)}
					</Button>
				</form>
			</Form>
		</CardContent>
	);
};
