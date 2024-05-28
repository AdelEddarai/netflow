import { checkIfUserCompletedOnboarding } from '@/lib/checkIfUserCompletedOnboarding';
import { DashboardHeader } from '@/components/header/DashboardHeader';
import { Calendar } from '@/components/calendar/Calendar';
import { AddTaskShortcut } from '@/components/addTaskShortcut/AddTaskShortcut';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'StudyFlow - Calendar',
};

const CalendarPage = async () => {
	const session = await checkIfUserCompletedOnboarding();

	return (
		<>
			<DashboardHeader>
				<AddTaskShortcut userId={session.user.id} />
			</DashboardHeader>
			<main className='h-full'>
				<Calendar userId={session.user.id} />
			</main>
		</>
	);
};
export default CalendarPage;
