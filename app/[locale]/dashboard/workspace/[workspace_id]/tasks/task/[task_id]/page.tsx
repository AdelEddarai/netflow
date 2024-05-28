import { AddTaskShortcut } from '@/components/addTaskShortcut/AddTaskShortcut';
import { DashboardHeader } from '@/components/header/DashboardHeader';
import { InviteUsers } from '@/components/inviteUsers/InviteUsers';
import { ReadOnlyContent } from '@/components/tasks/readOnly/ReadOnlyContent';
import { getTask, getUserWorkspaceRole, getWorkspace } from '@/lib/api';
import { getAuthSession } from '@/lib/auth';
import { changeCodeToEmoji } from '@/lib/changeCodeToEmoji';
import { checkIfUserCompletedOnboarding } from '@/lib/checkIfUserCompletedOnboarding';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Params {
	params: {
		workspace_id: string;
		task_id: string;
	};
}

export async function generateMetadata({ params: { task_id } }: Params): Promise<Metadata> {
	const session = await getAuthSession();

	if (!session) notFound();
	const task = await getTask(task_id, session.user.id);

	if (task)
		return {
			title: task.title.length > 0 ? task.title : 'Untitled task',
		};

	return {};
}

const Task = async ({ params: { workspace_id, task_id } }: Params) => {
	const session = await checkIfUserCompletedOnboarding();

	const [workspace, userRole, task] = await Promise.all([
		getWorkspace(workspace_id, session.user.id),
		getUserWorkspaceRole(workspace_id, session.user.id),
		getTask(task_id, session.user.id),
	]);

	if (!workspace || !userRole || !task) notFound();

	const isSavedByUser =
		task.savedTask?.find((task) => task.userId === session.user.id) !== undefined;

	return (
		<>
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
					{
						emoji: changeCodeToEmoji(task.emoji),
						name: `${task.title ? task.title : 'UNTITLED'}`,
						href: '/',
						useTranslate: task.title ? false : true,
					},
				]}>
				{(userRole === 'ADMIN' || userRole === 'OWNER') && <InviteUsers workspace={workspace} />}
				<AddTaskShortcut userId={session.user.id} />
			</DashboardHeader>
			<main className='flex flex-col gap-2  '>
				<ReadOnlyContent task={task} isSavedByUser={isSavedByUser} userRole={userRole} />
			</main>
		</>
	);
};
export default Task;
