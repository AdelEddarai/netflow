import { AddTaskShortcut } from '@/components/addTaskShortcut/AddTaskShortcut';
import { DashboardHeader } from '@/components/header/DashboardHeader';
import { InviteUsers } from '@/components/inviteUsers/InviteUsers';
import { WorkspaceTab } from '@/components/settings/workspace/WorkspaceTab';
import { getWorkspaceSettings } from '@/lib/api';
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
	const workspace = await getWorkspaceSettings(workspace_id, session.user.id);

	if (workspace)
		return {
			title: `${workspace.name} - Settings`,
		};

	return {};
}

const Workspace = async ({ params: { workspace_id } }: Params) => {
	const session = await checkIfUserCompletedOnboarding();

	const workspace = await getWorkspaceSettings(workspace_id, session.user.id);
	if (!workspace) notFound();
	const user = workspace.subscribers.find((subscrier) => subscrier.user.id === session.user.id);

	return (
		<>
			<DashboardHeader
				className='mb-2 sm:mb-0'
				addManualRoutes={[
					{
						name: 'DASHBOARD',
						href: '/dashboard',
						useTranslate: true,
					},
					{
						name: 'settings',
						href: '/dashboard/settings',
					},
					{
						name: workspace.name,
						href: '/',
					},
				]}>
				{(user?.userRole === 'ADMIN' || user?.userRole === 'OWNER') && (
					<InviteUsers workspace={workspace} />
				)}
				<AddTaskShortcut userId={session.user.id} />
			</DashboardHeader>
			<main className='flex flex-col gap-2'>
				<WorkspaceTab workspace={workspace} workspaceId={workspace.id} />
			</main>
		</>
	);
};
export default Workspace;
