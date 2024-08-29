import React from 'react';
import { ProviderSignInBtn } from './ProviderSignInBtn';
import { useTranslations } from 'next-intl';
import { GithubLogo } from '../svg/GithubLogo';
import { GoogleLogo } from '../svg/GoogleLogo';

interface Props {
	signInCard?: boolean;
	disabled?: boolean;
	onLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const ProviderSigInBtns = ({ signInCard, disabled, onLoading }: Props) => {
	const t = useTranslations('AUTH');
	return (
		<div className='flex flex-col gap-2'>
			<ProviderSignInBtn
				disabled={disabled}
				onLoading={onLoading}
				providerName='google'
				className='w-full rounded-[1.9rem] border text-sm h-12 sm:h-10 sm:text-base  '>
				<GoogleLogo className='mr-2' width={20} height={20} />
				{signInCard ? t('SIGN_IN.PROVIDERS.GOOGLE') : t('SIGN_UP.PROVIDERS.GOOGLE')}
			</ProviderSignInBtn>
			<ProviderSignInBtn
				disabled={disabled}
				onLoading={onLoading}
				providerName='github'
				className='w-full rounded-[1.9rem] border text-sm h-12 sm:h-10 sm:text-base'>
				<GithubLogo className='fill-foreground mr-2' width={20} height={20} />
				{signInCard ? t('SIGN_IN.PROVIDERS.GITHUB') : t('SIGN_UP.PROVIDERS.GITHUB')}
			</ProviderSignInBtn>
		</div>
	);
};
