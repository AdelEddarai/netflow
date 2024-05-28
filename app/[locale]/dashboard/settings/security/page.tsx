import { AddTaskShortcut } from '@/components/addTaskShortcut/AddTaskShortcut';
import { DashboardHeader } from '@/components/header/DashboardHeader';
import { SecurityCrad } from '@/components/settings/security/SecurityCrad';
import { checkIfUserCompletedOnboarding } from '@/lib/checkIfUserCompletedOnboarding';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'StudyFlow - Security Settings',
};

const SecuritySettings = async () => {
	const session = await checkIfUserCompletedOnboarding();
	return (
		<>
			<DashboardHeader>
				<AddTaskShortcut userId={session.user.id} />
			</DashboardHeader>
			<SecurityCrad />
		</>
	);
};
export default SecuritySettings;
