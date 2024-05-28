'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { SignUpSchema, signUpSchema } from '@/schema/signUpSchema';
import { CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { ProviderSigInBtns } from './ProviderSigInBtns';
import { LoadingState } from '@/components/ui/loading-state';
import { useRouter } from 'next-intl/client';
import { signIn } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';

export const SignUpCardContent = () => {
	const t = useTranslations('AUTH');
	const m = useTranslations('MESSAGES');
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<SignUpSchema>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: '',
			password: '',
			username: '',
		},
	});

	const onSubmit = async (data: SignUpSchema) => {
		setIsLoading(true);
		try {
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!res.ok) throw new Error('ERRORS.DEFAULT');
			const signUpInfo = await res.json();
			if (res.status === 200) {
				toast({
					title: m('SUCCES.SIGN_UP'),
				});
				await signIn('credentials', {
					email: data.email,
					password: data.password,
					redirect: false,
				});

				router.push(`/onboarding`);
				router.refresh();
			} else throw new Error(signUpInfo);
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
					<ProviderSigInBtns onLoading={setIsLoading} disabled={isLoading} />
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
							name='username'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input placeholder={t('USERNAME')} {...field} />
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
					<div className='space-y-2'>
						<Button disabled={isLoading} className='w-full font-bold text-white ' type='submit'>
							{isLoading ? (
								<LoadingState loadingText={m('PENDING.LOADING')} />
							) : (
								t('SIGN_UP.SUBMIT_BTN')
							)}
						</Button>
						<p className='text-xs text-center text-muted-foreground'>
							{t('SIGN_UP.TERMS.FIRST')}{' '}
							<span className='font-bold'>{t('SIGN_UP.TERMS.SECOND')}</span>
						</p>
					</div>
				</form>
			</Form>
		</CardContent>
	);
};
