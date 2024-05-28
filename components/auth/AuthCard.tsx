import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SignUpCardContent } from './SignUpCardContent';
import { SignInCardContent } from './SignInCardContent';
import { useTranslations } from 'next-intl';
import Link from 'next-intl/link';
import { AppLogo } from '@/components/ui/app-logo';

interface Props {
	signInCard?: boolean;
}

export const AuthCard = ({ signInCard }: Props) => {
	const t = useTranslations('AUTH');
	return (
		<>
			<Card className='w-full sm:w-[30rem] mt-14 sm:mt-0'>
				<CardHeader className='pb-0 sm:pb-0'>
					<Link className='w-fit mx-auto mb-2' href={'/'}>
						<AppLogo />
					</Link>
					<CardTitle>{signInCard ? t('SIGN_IN.TITLE') : t('SIGN_UP.TITLE')}</CardTitle>
					<CardDescription>{signInCard ? t('SIGN_IN.DESC') : t('SIGN_UP.DESC')}</CardDescription>
				</CardHeader>
				{signInCard ? <SignInCardContent /> : <SignUpCardContent />}
			</Card>
			<p className='text-sm'>
				{signInCard ? t('SIGN_IN.DONT_HAVE_ACCOUNT.FIRST') : t('SIGN_UP.HAVE_ACCOUNT.FIRST')}{' '}
				<Link className='text-primary' href={signInCard ? '/sign-up' : '/sign-in'}>
					{signInCard ? t('SIGN_IN.DONT_HAVE_ACCOUNT.SECOND') : t('SIGN_UP.HAVE_ACCOUNT.SECOND')}
				</Link>{' '}
			</p>
		</>
	);
};
