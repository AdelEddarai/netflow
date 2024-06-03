import { AddTaskShortcut } from '@/components/addTaskShortcut/AddTaskShortcut';
import Welcoming from '@/components/common/Welcoming';
import { DashboardHeader } from '@/components/header/DashboardHeader';
import { HomeRecentActivityContainer } from '@/components/homeRecentAcrivity/HomeRecentActivityContainer';
import { getInitialHomeRecentActivitiy } from '@/lib/api';
import { checkIfUserCompletedOnboarding } from '@/lib/checkIfUserCompletedOnboarding';

const Dashboard = async () => {
	const session = await checkIfUserCompletedOnboarding();

	const initialRecentActivity = await getInitialHomeRecentActivitiy(session.user.id);

	return (
		<>
			<DashboardHeader>
				<AddTaskShortcut userId={session.user.id} />
			</DashboardHeader>
			<main className='h-full w-full'>
				<Welcoming
					hideOnDesktop
					username={session.user.username!}
					name={session.user.name}
					surname={session.user.surname}
					className='px-4 py-2 '
				/>
				<HomeRecentActivityContainer
					userId={session.user.id}
					initialData={initialRecentActivity ? initialRecentActivity : []}
				/>
			</main>
		</>
	);
};
export default Dashboard;
