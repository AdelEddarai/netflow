import { AuthCard } from '@/components/auth/AuthCard';
import { getAuthSession } from '@/lib/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
	title: 'Sign up',
	description: 'Sign up',
};

const SignUp = async () => {
	const session = await getAuthSession();
	if (session) redirect('/');

	return <AuthCard />;
};
export default SignUp;
