import { AddTaskShortcut } from '@/components/addTaskShortcut/AddTaskShortcut';
import { DashboardHeader } from '@/components/header/DashboardHeader';
import { Theme } from '@/components/settings/theme/Theme';
import { checkIfUserCompletedOnboarding } from '@/lib/checkIfUserCompletedOnboarding';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'StudyFlow - Theme Settings',
};

const ThemeSettings = async () => {
	const session = await checkIfUserCompletedOnboarding();
	return (
		<>
			<DashboardHeader>
				<AddTaskShortcut userId={session.user.id} />
			</DashboardHeader>
			<Theme />
		</>
	);
};
export default ThemeSettings;
