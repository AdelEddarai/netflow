import { redirect } from 'next-intl/server';
import { getAuthSession } from './auth';

export const checkIfUserCompletedOnboarding = async (onboardingSite?: boolean) => {
	const session = await getAuthSession();
	if (!session) redirect('/');
	if (session.user.completedOnboarding && onboardingSite) redirect('/dashboard');
	if (!session.user.completedOnboarding && !onboardingSite) redirect('/onboarding');

	return session;
};
