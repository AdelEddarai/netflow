'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { signIn } from 'next-auth/react';
import { useProviderLoginError } from '@/hooks/useProviderLoginError';
import { useLocale } from 'next-intl';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	providerName: 'google' | 'github';
	onLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ProviderSignInBtn = ({ children, providerName, onLoading, ...props }: Props) => {
	const [showLoggedInfo, setShowLoggedInfo] = useState(false);
	const locale = useLocale();
	useProviderLoginError(showLoggedInfo);

	const signInHandler = async () => {
		onLoading(true);
		setShowLoggedInfo(true);
		try {
			await signIn(providerName, { callbackUrl: `/${locale}/onboarding` });
		} catch (_) {}
		onLoading(false);
	};

	return (
		<Button onClick={signInHandler} variant={'secondary'} type='button' {...props}>
			{children}
		</Button>
	);
};
