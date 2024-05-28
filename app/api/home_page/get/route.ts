import { db } from '@/lib/db';
import { sortMindMapsAndTasksDataByUpdatedAt } from '@/lib/sortMindMapsAndTasksDataByUpdatedAt';
import { HomeRecentActivity } from '@/types/extended';
import { NextResponse } from 'next/server';

export const GET = async (request: Request) => {
	const url = new URL(request.url);
	const userId = url.searchParams.get('userId');
	const take = url.searchParams.get('take');
	const page = url.searchParams.get('page');

	if (!userId || !take || !page) return NextResponse.json('ERRORS.WRONG_DATA', { status: 404 });
	const takeValue = parseInt(take ? take : '');
	const pageValue = parseInt(page ? page : '');

	const skipValue = takeValue * (pageValue - 1);

	try {
		const tasks = await db.task.findMany({
			where: {
				workspace: {
					subscribers: {
						some: {
							userId,
						},
					},
				},
			},
			include: {
				updatedBy: {
					select: {
						username: true,
						name: true,
						id: true,
						image: true,
						surname: true,
					},
				},
				savedTask: {
					where: {
						userId,
					},
					select: {
						taskId: true,
					},
				},
				workspace: true,
			},
			orderBy: {
				updatedAt: 'desc',
			},
			skip: skipValue,
			take: takeValue,
		});

		const mindMaps = await db.mindMap.findMany({
			where: {
				workspace: {
					subscribers: {
						some: {
							userId,
						},
					},
				},
			},
			include: {
				updatedBy: {
					select: {
						username: true,
						name: true,
						id: true,
						image: true,
						surname: true,
					},
				},
				savedMindMaps: {
					where: {
						userId,
					},
					select: {
						mindMapId: true,
					},
				},
				workspace: true,
			},
			orderBy: {
				updatedAt: 'desc',
			},
			skip: skipValue,
			take: takeValue,
		});

		const tasksData: HomeRecentActivity[] = tasks.map((task) => ({
			id: task.id,
			title: task.title,
			emoji: task.emoji,
			link: `/dashboard/workspace/${task.workspaceId}/tasks/task/${task.id}`,
			workspaceName: task.workspace.name,
			createdAt: task.createdAt,
			type: 'task',
			updated: {
				at: task.updatedAt,
				by: task.updatedBy,
			},
			workspaceId: task.workspaceId,
			starred: task.savedTask.length > 0,
		}));

		const mindMapsData: HomeRecentActivity[] = mindMaps.map((mindMap) => ({
			id: mindMap.id,
			title: mindMap.title,
			emoji: mindMap.emoji,
			link: `/dashboard/workspace/${mindMap.workspaceId}/mind-maps/mind-map/${mindMap.id}`,
			workspaceName: mindMap.workspace.name,
			createdAt: mindMap.createdAt,
			type: 'mindMap',
			updated: {
				at: mindMap.updatedAt,
				by: mindMap.updatedBy,
			},
			workspaceId: mindMap.workspaceId,
			starred: mindMap.savedMindMaps.length > 0,
		}));

		return NextResponse.json(
			sortMindMapsAndTasksDataByUpdatedAt({ tasks: tasksData, mindMaps: mindMapsData }),
			{
				status: 200,
			}
		);
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
};
