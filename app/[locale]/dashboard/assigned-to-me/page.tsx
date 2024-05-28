import { checkIfUserCompletedOnboarding } from '@/lib/checkIfUserCompletedOnboarding';
import { DashboardHeader } from '@/components/header/DashboardHeader';
import { AssignedToMeContainer } from '@/components/assignedToMe/AssignedToMeContainer';
import { AddTaskShortcut } from '@/components/addTaskShortcut/AddTaskShortcut';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'StudyFlow - Assigned to me',
};

const AssignedToMe = async () => {
	const session = await checkIfUserCompletedOnboarding();

	return (
		<>
			<DashboardHeader>
				<AddTaskShortcut userId={session.user.id} />
			</DashboardHeader>
			<main>
				<AssignedToMeContainer userId={session.user.id} />
			</main>
		</>
	);
};
export default AssignedToMe;
