import { checkIfUserCompletedOnboarding } from '@/lib/checkIfUserCompletedOnboarding';
import { DashboardHeader } from '@/components/header/DashboardHeader';
import { StarredContainer } from '@/components/starred/StarredContainer';
import { AddTaskShortcut } from '@/components/addTaskShortcut/AddTaskShortcut';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'StudyFlow - Starred',
};

const Starred = async () => {
	const session = await checkIfUserCompletedOnboarding();

	return (
		<>
			<DashboardHeader>
				<AddTaskShortcut userId={session.user.id} />
			</DashboardHeader>
			<main>
				<StarredContainer userId={session.user.id} />
			</main>
		</>
	);
};
export default Starred;
