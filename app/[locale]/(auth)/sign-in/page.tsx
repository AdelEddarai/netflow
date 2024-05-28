import { AuthCard } from '@/components/auth/AuthCard';
import { Metadata } from 'next';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';


export const metadata: Metadata = {
	title: 'Sign in',
	description: 'Sign in',
};

const SignIn =async () => {
	const session = await getAuthSession();
	if (session) redirect('/');

	return <AuthCard signInCard />;
};
export default SignIn;
