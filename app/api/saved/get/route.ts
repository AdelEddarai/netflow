import { compareDates } from '@/lib/compareDates';
import { db } from '@/lib/db';
import { StarredItem } from '@/types/saved';
import { NextResponse } from 'next/server';

export const GET = async (request: Request) => {
	const url = new URL(request.url);
	const userId = url.searchParams.get('userId');
	const sort = url.searchParams.get('sort');

	const sortType = sort && sort === 'asc' ? false : true;

	if (!userId) return NextResponse.json('ERRORS.WRONG_DATA', { status: 404 });
	try {
		const savedByUser = await db.user.findUnique({
			where: {
				id: userId,
			},
			include: {
				savedMindMaps: {
					include: {
						mindMap: {
							select: {
								emoji: true,
								title: true,
								updatedAt: true,
								updatedBy: {
									select: {
										username: true,
										name: true,
										id: true,
										image: true,
										surname: true,
									},
								},
								workspace: {
									select: {
										name: true,
										id: true,
									},
								},
							},
						},
					},
				},
				savedTask: {
					include: {
						task: {
							select: {
								emoji: true,
								title: true,
								updatedAt: true,
								updatedBy: {
									select: {
										username: true,
										name: true,
										id: true,
										image: true,
										surname: true,
									},
								},
								workspace: {
									select: {
										name: true,
										id: true,
									},
								},
							},
						},
					},
				},
			},
		});

		if (!savedByUser) return NextResponse.json('ERRORS.NO_USER_API', { status: 404 });

		const mappedMindMaps: StarredItem[] = savedByUser.savedMindMaps.map((mindMap) => ({
			id: mindMap.id,
			link: `/dashboard/workspace/${mindMap.mindMap.workspace.id}/mind-maps/mind-map/${mindMap.mindMapId}`,
			workspaceId: mindMap.mindMap.workspace.id,
			type: 'mindMap',
			title: mindMap.mindMap.title,
			emoji: mindMap.mindMap.emoji,
			workspaceName: mindMap.mindMap.workspace.name,
			updated: {
				at: mindMap.mindMap.updatedAt,
				by: mindMap.mindMap.updatedBy,
			},
			itemId: mindMap.mindMapId,
		}));

		const mappedTasks: StarredItem[] = savedByUser.savedTask.map((task) => ({
			id: task.id,
			link: `/dashboard/workspace/${task.task.workspace.id}/tasks/task/${task.taskId}`,
			workspaceId: task.task.workspace.id,
			type: 'task',
			title: task.task.title,
			emoji: task.task.emoji,
			workspaceName: task.task.workspace.name,
			updated: {
				at: task.task.updatedAt,
				by: task.task.updatedBy,
			},
			itemId: task.taskId,
		}));

		const mappedSavedInfo = [...mappedMindMaps, ...mappedTasks];

		const sortedSavedInfo = mappedSavedInfo.sort((a, b) => compareDates(a, b, sortType));

		return NextResponse.json(sortedSavedInfo, { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
};
