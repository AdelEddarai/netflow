'use client';
import { useRouter } from 'next-intl/client';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export const useProviderLoginError = (showLoggedInfo: boolean) => {
	const m = useTranslations('MESSAGES');
	const params = useSearchParams();
	const router = useRouter();
	const session = useSession();
	const { toast } = useToast();

	useEffect(() => {
		const error = params.get('error');
		if (error && session.status === 'unauthenticated') {
			switch (error) {
				case 'OAuthAccountNotLinked':
					toast({
						title: m('ERRORS.TAKEN_EMAIL'),
						variant: 'destructive',
					});
					break;
				case 'OAuthCreateAccount':
					toast({
						title: m('ERRORS.TAKEN_USERNAME'),
						variant: 'destructive',
					});
					break;
				case 'Callback':
					toast({
						title: m('ABORDED'),
						variant: 'destructive',
					});
					break;

				default:
					toast({
						title: m('ERRORS.DEFAULT'),
						variant: 'destructive',
					});
			}

			const timer = setTimeout(() => {
				router.replace('/sign-in');
			}, 2000);
			return () => {
				clearTimeout(timer);
			};
		}
		if (session.status === 'authenticated' && showLoggedInfo) {
			toast({
				title: m('SUCCES.SIGN_IN'),
			});
		}
	}, [params, toast, session, router, m, showLoggedInfo]);
};
