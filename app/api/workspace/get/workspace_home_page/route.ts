import { db } from '@/lib/db';
import { sortMindMapsAndTasksDataByUpdatedAt } from '@/lib/sortMindMapsAndTasksDataByUpdatedAt';
import { WorkspaceRecentActivity } from '@/types/extended';
import { NextResponse } from 'next/server';

export const GET = async (request: Request) => {
	const url = new URL(request.url);
	const workspaceId = url.searchParams.get('workspaceId');
	const userId = url.searchParams.get('userId');

	if (!userId || !workspaceId) return NextResponse.json('ERRORS.WRONG_DATA', { status: 404 });
	try {
		const workspacesData = await db.workspace.findUnique({
			where: {
				id: workspaceId,
			},
			include: {
				tasks: {
					include: {
						assignedToTask: {
							include: {
								user: {
									select: {
										id: true,
										username: true,
										image: true,
									},
								},
							},
						},
						tags: {
							select: {
								id: true,
								color: true,
								name: true,
								workspaceId: true,
							},
						},
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
					},
					orderBy: {
						updatedAt: 'desc',
					},
					take: 10,
				},
				mindMaps: {
					include: {
						assignedToMindMap: {
							include: {
								user: {
									select: {
										id: true,
										username: true,
										image: true,
									},
								},
							},
						},
						tags: {
							select: {
								id: true,
								color: true,
								name: true,
								workspaceId: true,
							},
						},
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
					},
					orderBy: {
						updatedAt: 'desc',
					},
					take: 10,
				},
			},
		});

		const mindMapInfo: WorkspaceRecentActivity[] = workspacesData
			? workspacesData.mindMaps.map((mindMap) => {
					return {
						id: mindMap.id,
						title: mindMap.title,
						emoji: mindMap.emoji,
						type: 'mindMap',
						updated: {
							at: mindMap.updatedAt,
							by: mindMap.updatedBy,
						},
						starred: mindMap.savedMindMaps.length > 0,
						tags: mindMap.tags,
						assignedTo: mindMap.assignedToMindMap,
						link: `/dashboard/workspace/${workspaceId}/mind-maps/mind-map/${mindMap.id}`,
					};
			  })
			: [];

		const taskInfo: WorkspaceRecentActivity[] = workspacesData
			? workspacesData.tasks.map((task) => {
					return {
						id: task.id,
						title: task.title,
						emoji: task.emoji,
						type: 'task',
						updated: {
							at: task.updatedAt,
							by: task.updatedBy,
						},
						starred: task.savedTask.length > 0,
						tags: task.tags,
						assignedTo: task.assignedToTask,
						link: `/dashboard/workspace/${workspaceId}/tasks/task/${task.id}`,
					};
			  })
			: [];

		return NextResponse.json(
			sortMindMapsAndTasksDataByUpdatedAt({ tasks: taskInfo, mindMaps: mindMapInfo }),
			{ status: 200 }
		);
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
};
