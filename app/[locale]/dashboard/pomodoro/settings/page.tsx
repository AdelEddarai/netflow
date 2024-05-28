import { checkIfUserCompletedOnboarding } from '@/lib/checkIfUserCompletedOnboarding';
import { DashboardHeader } from '@/components/header/DashboardHeader';
import { SettingsContainer } from '@/components/pomodoro/settings/SettingsContainer';
import { getUserPomodoroSettings } from '@/lib/api';
import { AddTaskShortcut } from '@/components/addTaskShortcut/AddTaskShortcut';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'StudyFlow - Pomodoro Settings',
};

const PomodoroSettings = async () => {
	const session = await checkIfUserCompletedOnboarding();

	const pomodoroSettings = await getUserPomodoroSettings(session.user.id);
	if (!pomodoroSettings) notFound();

	return (
		<>
			<DashboardHeader>
				<AddTaskShortcut userId={session.user.id} />
			</DashboardHeader>
			<main className='flex flex-col gap-2 h-full'>
				<SettingsContainer pomodoroSettings={pomodoroSettings} />
			</main>
		</>
	);
};
export default PomodoroSettings;
