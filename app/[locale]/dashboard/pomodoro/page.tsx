import { checkIfUserCompletedOnboarding } from '@/lib/checkIfUserCompletedOnboarding';
import { DashboardHeader } from '@/components/header/DashboardHeader';
import { getUserPomodoroSettings } from '@/lib/api';
import { PomodoroContainer } from '@/components/pomodoro/timer/PomodoroContainer';
import { AddTaskShortcut } from '@/components/addTaskShortcut/AddTaskShortcut';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'StudyFlow - Pomodoro',
};

const Pomodoro = async () => {
	const session = await checkIfUserCompletedOnboarding();

	const pomodoroSettings = await getUserPomodoroSettings(session.user.id);
	if (!pomodoroSettings) notFound();

	return (
		<>
			<DashboardHeader>
				<AddTaskShortcut userId={session.user.id} />
			</DashboardHeader>
			<main className='flex flex-col gap-2 h-full  items-center'>
				<PomodoroContainer pomodoroSettings={pomodoroSettings} />
			</main>
		</>
	);
};
export default Pomodoro;
