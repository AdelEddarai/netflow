import {
	ExtendedMessage,
	ExtendedMindMap,
	ExtendedTask,
	ExtendedWorkspace,
	HomeRecentActivity,
	SettingsWorkspace,
} from '@/types/extended';
import { PomodoroSettings, UserPermisson, Workspace } from '@prisma/client';
import { notFound } from 'next/navigation';
import { ACTIVITY_PER_PAGE } from './constants';

export const domain =
	process.env.NODE_ENV === 'production'
		? 'https://studyflow-app.vercel.app'
		: 'http://localhost:3000';

export const getWorkspace = async (workspace_id: string, user_id: string) => {
	try {
		const res = await fetch(
			`${domain}/api/workspace/get/workspace_details/${workspace_id}?userId=${user_id}`,
			{
				method: 'GET',
				cache: 'no-store',
			}
		);
		if (!res.ok) {
			return notFound();
		}
		return res.json() as Promise<Workspace>;
	} catch (err) {}
};

export const getWorkspaceWithChatId = async (workspace_id: string, user_id: string) => {
	try {
		const res = await fetch(
			`${domain}/api/workspace/get/workspace_with_chat/${workspace_id}?userId=${user_id}`,
			{
				method: 'GET',
				cache: 'no-store',
			}
		);
		if (!res.ok) {
			return notFound();
		}
		return res.json() as Promise<ExtendedWorkspace>;
	} catch (err) {}
};

export const getWorkspaceSettings = async (workspace_id: string, user_id: string) => {
	try {
		const res = await fetch(
			`${domain}/api/workspace/get/settings/${workspace_id}?userId=${user_id}`,
			{
				method: 'GET',
				cache: 'no-store',
			}
		);
		if (!res.ok) {
			return notFound();
		}
		return res.json() as Promise<SettingsWorkspace>;
	} catch (err) {}
};

export const getWorkspaces = async (user_id: string) => {
	try {
		const res = await fetch(`${domain}/api/workspace/get/user_workspaces?userId=${user_id}`, {
			method: 'GET',
			cache: 'no-store',
		});
		if (!res.ok) {
			return [];
		}
		return res.json() as Promise<Workspace[]>;
	} catch (err) {}
};

export const getUserAdminWorkspaces = async (user_id: string) => {
	try {
		const res = await fetch(`${domain}/api/workspace/get/user_admin_workspaces?userId=${user_id}`, {
			method: 'GET',
			cache: 'no-store',
		});
		if (!res.ok) {
			return [];
		}
		return res.json() as Promise<Workspace[]>;
	} catch (err) {}
};

export const getUserWorkspaceRole = async (workspace_id: string, user_id: string) => {
	try {
		const res = await fetch(
			`${domain}/api/workspace/get/user_role?workspaceId=${workspace_id}&userId=${user_id}`,
			{
				method: 'GET',
				cache: 'no-store',
			}
		);
		if (!res.ok) {
			return null;
		}
		return res.json() as Promise<UserPermisson>;
	} catch (err) {}
};

export const getTask = async (task_id: string, user_id: string) => {
	try {
		const res = await fetch(`${domain}/api/task/get/details/${task_id}?userId=${user_id}`, {
			method: 'GET',
			cache: 'no-store',
		});
		if (!res.ok) {
			return notFound();
		}
		return res.json() as Promise<ExtendedTask>;
	} catch (err) {}
};

export const getMindMap = async (mind_map_id: string, user_id: string) => {
	try {
		const res = await fetch(
			`${domain}/api/mind_maps/get/details/${mind_map_id}?userId=${user_id}`,
			{
				method: 'GET',
				cache: 'no-store',
			}
		);
		if (!res.ok) {
			return notFound();
		}
		return res.json() as Promise<ExtendedMindMap>;
	} catch (err) {}
};
export const getUserPomodoroSettings = async (user_id: string) => {
	try {
		const res = await fetch(`${domain}/api/pomodoro/get_settings?userId=${user_id}`, {
			method: 'GET',
			cache: 'no-store',
		});
		if (!res.ok) {
			return notFound();
		}
		return res.json() as Promise<PomodoroSettings>;
	} catch (err) {}
};
export const getInitialHomeRecentActivitiy = async (userId: string) => {
	try {
		const res = await fetch(
			`${domain}/api/home_page/get?userId=${userId}&page=${1}&take=${ACTIVITY_PER_PAGE}`,
			{
				method: 'GET',
				cache: 'no-store',
			}
		);
		if (!res.ok) {
			return [];
		}
		return res.json() as Promise<HomeRecentActivity[]>;
	} catch (err) {}
};
export const getInitialMessages = async (userId: string, chatId: string) => {
	try {
		const res = await fetch(
			`${domain}/api/conversation/get/messages?userId=${userId}&chatId=${chatId}`,
			{
				method: 'GET',
				cache: 'no-store',
			}
		);
		if (!res.ok) {
			return [];
		}
		return res.json() as Promise<ExtendedMessage[]>;
	} catch (err) {}
};
