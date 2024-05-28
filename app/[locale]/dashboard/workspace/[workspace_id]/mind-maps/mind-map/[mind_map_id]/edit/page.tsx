import { AddTaskShortcut } from '@/components/addTaskShortcut/AddTaskShortcut';
import { DashboardHeader } from '@/components/header/DashboardHeader';
import { InviteUsers } from '@/components/inviteUsers/InviteUsers';
import { MindMap } from '@/components/mindMaps/MindMap';
import { AutoSaveMindMapProvider } from '@/context/AutoSaveMindMap';
import { AutosaveIndicatorProvider } from '@/context/AutosaveIndicator';
import { getMindMap, getUserWorkspaceRole, getWorkspace } from '@/lib/api';
import { getAuthSession } from '@/lib/auth';
import { checkIfUserCompletedOnboarding } from '@/lib/checkIfUserCompletedOnboarding';
import { Metadata } from 'next';
import { redirect } from 'next-intl/server';
import { notFound } from 'next/navigation';

interface Params {
	params: {
		workspace_id: string;
		mind_map_id: string;
	};
}

export async function generateMetadata({ params: { mind_map_id } }: Params): Promise<Metadata> {
	const session = await getAuthSession();

	if (!session) notFound();
	const mindMap = await getMindMap(mind_map_id, session.user.id);

	if (mindMap)
		return {
			title: `${mindMap.title.length > 0 ? mindMap.title : 'Untitled mindMap'} - Edit`,
		};

	return {};
}

const EditMindMapPage = async ({ params: { workspace_id, mind_map_id } }: Params) => {
	const session = await checkIfUserCompletedOnboarding();

	const [workspace, userRole, mindMap] = await Promise.all([
		getWorkspace(workspace_id, session.user.id),
		getUserWorkspaceRole(workspace_id, session.user.id),
		getMindMap(mind_map_id, session.user.id),
	]);

	if (!workspace || !userRole || !mindMap) notFound();

	const candEdit =
		userRole === 'ADMIN' || userRole === 'OWNER' || userRole === 'CAN_EDIT' ? true : false;
	if (!candEdit) redirect(`/dashboard/workspace/${workspace_id}/tasks/task/${mind_map_id}`);

	return (
		<AutosaveIndicatorProvider>
			<AutoSaveMindMapProvider>
				<DashboardHeader showBackBtn hideBreadCrumb showSavingStatus>
					{(userRole === 'ADMIN' || userRole === 'OWNER') && <InviteUsers workspace={workspace} />}
					<AddTaskShortcut userId={session.user.id} />
				</DashboardHeader>
				<main className='flex flex-col gap-2 h-full'>
					<MindMap
						initialActiveTags={mindMap.tags}
						initialInfo={mindMap}
						workspaceId={workspace.id}
						candEdit={candEdit}
					/>
				</main>
			</AutoSaveMindMapProvider>
		</AutosaveIndicatorProvider>
	);
};
export default EditMindMapPage;
