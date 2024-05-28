import { AddTaskShortcut } from '@/components/addTaskShortcut/AddTaskShortcut';
import { DashboardHeader } from '@/components/header/DashboardHeader';
import { InviteUsers } from '@/components/inviteUsers/InviteUsers';
import { FilterContainer } from '@/components/workspaceMainPage/filter/FilterContainer';
import { RecentActivityContainer } from '@/components/workspaceMainPage/recentActivity/RecentActivityContainer';
import { ShortcutContainer } from '@/components/workspaceMainPage/shortcuts/ShortcutContainer';
import { FilterByUsersAndTagsInWorkspaceProvider } from '@/context/FilterByUsersAndTagsInWorkspace';
import { getUserWorkspaceRole, getWorkspaceWithChatId } from '@/lib/api';
import { getAuthSession } from '@/lib/auth';
import { checkIfUserCompletedOnboarding } from '@/lib/checkIfUserCompletedOnboarding';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Params {
	params: {
		workspace_id: string;
	};
}

export async function generateMetadata({ params: { workspace_id } }: Params): Promise<Metadata> {
	const session = await getAuthSession();

	if (!session) notFound();
	const workspace = await getWorkspaceWithChatId(workspace_id, session.user.id);

	if (workspace)
		return {
			title: workspace.name,
		};

	return {};
}

const Workspace = async ({ params: { workspace_id } }: Params) => {
	const session = await checkIfUserCompletedOnboarding();

	const [workspace, userRole] = await Promise.all([
		getWorkspaceWithChatId(workspace_id, session.user.id),
		getUserWorkspaceRole(workspace_id, session.user.id),
	]);

	if (!workspace || !userRole) notFound();

	return (
		<FilterByUsersAndTagsInWorkspaceProvider>
			<DashboardHeader
				addManualRoutes={[
					{
						name: 'DASHBOARD',
						href: '/dashboard',
						useTranslate: true,
					},
					{
						name: workspace.name,
						href: `/dashboard/workspace/${workspace_id}`,
					},
				]}>
				{(userRole === 'ADMIN' || userRole === 'OWNER') && <InviteUsers workspace={workspace} />}
				<AddTaskShortcut userId={session.user.id} />
			</DashboardHeader>
			<main className='flex flex-col gap-2 w-full'>
				<ShortcutContainer workspace={workspace} userRole={userRole} />
				<FilterContainer sessionUserId={session.user.id} />
				<RecentActivityContainer userId={session.user.id} workspaceId={workspace.id} />
			</main>
		</FilterByUsersAndTagsInWorkspaceProvider>
	);
};
export default Workspace;
