import { AddTaskShortcut } from '@/components/addTaskShortcut/AddTaskShortcut';
import Analytics from '@/components/Analytics/Analyticss';
import Welcoming from '@/components/common/Welcoming';
import { DashboardHeader } from '@/components/header/DashboardHeader';
import { Footer } from '@/components/home/footer/Footer';
import { HomeRecentActivityContainer } from '@/components/homeRecentAcrivity/HomeRecentActivityContainer';
// import  KanbanBoard  from '@/components/kanban/KanbanTable';
import { CommitGraph } from '@/components/magicui/commit-graph';
import { TableComponent } from '@/components/table/TableComponent';
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
				
				{/* TODO: add icon and more function in table    */}
				<TableComponent userId={session.user.id} initialData={initialRecentActivity ? initialRecentActivity : []} />
				<Analytics userId={session.user.id} initialData={initialRecentActivity ? initialRecentActivity : []} />
				<CommitGraph userId={session.user.id} initialData={initialRecentActivity ? initialRecentActivity : []} />
				<div className="p-3">
				{/* <KanbanBoard userId={session.user.id} initialData={initialRecentActivity ? initialRecentActivity : []} />		 */}
				<Footer />		
				</div>
				
			</main>
		</>
	);
};
export default Dashboard;
