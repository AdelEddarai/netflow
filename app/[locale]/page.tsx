import { HomePage } from '@/components/home/HomePage';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

const Home = async () => {
	const session = await getAuthSession();

	if (session) redirect('/dashboard');
	return <HomePage />;
};
export default Home;
