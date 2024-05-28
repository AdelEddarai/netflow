import { getUserAdminWorkspaces, getWorkspaces } from '@/lib/api';
import { SidebarContainer } from './SidebarContainer';
import { getAuthSession } from '@/lib/auth';

export const Sidebar = async () => {
	const session = await getAuthSession();
	if (!session) return null;

	const [userWorkspaces, userAdminWorkspaces] = await Promise.all([
		getWorkspaces(session.user.id),
		getUserAdminWorkspaces(session.user.id),
	]);

	return (
		<SidebarContainer
			userWorkspaces={userWorkspaces ? userWorkspaces : []}
			userAdminWorkspaces={userAdminWorkspaces ? userAdminWorkspaces : []}
			userId={session.user.id}
		/>
	);
};
