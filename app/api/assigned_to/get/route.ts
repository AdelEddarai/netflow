import { db } from '@/lib/db';
import { sortMindMapsAndTasksDataByUpdatedAt } from '@/lib/sortMindMapsAndTasksDataByUpdatedAt';
import { AssignedItemType, AssignedToMeTaskAndMindMaps } from '@/types/extended';
import { NextResponse } from 'next/server';

export const GET = async (request: Request) => {
	const url = new URL(request.url);
	const workspaceFilterParam = url.searchParams.get('workspace');
	const currentType = url.searchParams.get('type');
	const userId = url.searchParams.get('userId');

	if (!userId) return NextResponse.json('ERRORS.WRONG_DATA', { status: 404 });

	try {
		if (workspaceFilterParam && workspaceFilterParam !== 'all') {
			const taskAndMindMaps = await db.workspace.findUnique({
				where: {
					id: workspaceFilterParam,
				},
				include: {
					tasks: {
						where: {
							assignedToTask: {
								some: {
									userId,
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
						},
					},
					mindMaps: {
						where: {
							assignedToMindMap: {
								some: {
									userId,
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
						},
					},
				},
			});

			if (!taskAndMindMaps) return NextResponse.json('ERRORS.NO_WORKSPACE', { status: 404 });

			switch (currentType) {
				case 'tasks':
					const assignedTasksData: AssignedToMeTaskAndMindMaps = {
						tasks: taskAndMindMaps.tasks.map((task) => ({
							id: task.id,
							title: task.title,
							emoji: task.emoji,
							workspaceId: task.workspaceId,
							link: `/dashboard/workspace/${task.workspaceId}/tasks/task/${task.id}`,
							workspaceName: taskAndMindMaps.name,
							createdAt: task.createdAt,
							type: 'task',
							updated: {
								at: task.updatedAt,
								by: task.updatedBy,
							},
							starred: task.savedTask.length > 0,
						})),
						mindMaps: [],
					};
					return NextResponse.json(sortMindMapsAndTasksDataByUpdatedAt(assignedTasksData), {
						status: 200,
					});
				case 'mind-maps':
					const assignedMindMapsData: AssignedToMeTaskAndMindMaps = {
						tasks: [],
						mindMaps: taskAndMindMaps.mindMaps.map((mindMap) => ({
							id: mindMap.id,
							title: mindMap.title,
							emoji: mindMap.emoji,
							workspaceId: mindMap.workspaceId,
							link: `/dashboard/workspace/${mindMap.workspaceId}/tasks/task/${mindMap.id}`,
							workspaceName: taskAndMindMaps.name,
							createdAt: mindMap.createdAt,
							type: 'mindMap',
							updated: {
								at: mindMap.updatedAt,
								by: mindMap.updatedBy,
							},
							starred: mindMap.savedMindMaps.length > 0,
						})),
					};
					return NextResponse.json(sortMindMapsAndTasksDataByUpdatedAt(assignedMindMapsData), {
						status: 200,
					});

				default:
					const assignedAllData: AssignedToMeTaskAndMindMaps = {
						tasks: taskAndMindMaps.tasks.map((task) => ({
							id: task.id,
							title: task.title,
							emoji: task.emoji,
							workspaceId: task.workspaceId,
							link: `/dashboard/workspace/${task.workspaceId}/tasks/task/${task.id}`,
							workspaceName: taskAndMindMaps.name,
							createdAt: task.createdAt,
							type: 'task',
							updated: {
								at: task.updatedAt,
								by: task.updatedBy,
							},
							starred: task.savedTask.length > 0,
						})),
						mindMaps: taskAndMindMaps.mindMaps.map((mindMap) => ({
							id: mindMap.id,
							title: mindMap.title,
							emoji: mindMap.emoji,
							workspaceId: mindMap.workspaceId,
							link: `/dashboard/workspace/${mindMap.workspaceId}/tasks/task/${mindMap.id}`,
							workspaceName: taskAndMindMaps.name,
							createdAt: mindMap.createdAt,
							type: 'mindMap',
							updated: {
								at: mindMap.updatedAt,
								by: mindMap.updatedBy,
							},
							starred: mindMap.savedMindMaps.length > 0,
						})),
					};

					return NextResponse.json(sortMindMapsAndTasksDataByUpdatedAt(assignedAllData), {
						status: 200,
					});
			}
		} else {
			const taskAndMindMaps = await db.workspace.findMany({
				include: {
					tasks: {
						where: {
							assignedToTask: {
								some: {
									userId,
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
						},
					},
					mindMaps: {
						where: {
							assignedToMindMap: {
								some: {
									userId,
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
						},
					},
				},
			});

			if (taskAndMindMaps.length === 0) return NextResponse.json([], { status: 200 });

			const assignedData: AssignedToMeTaskAndMindMaps = {
				tasks: [],
				mindMaps: [],
			};

			switch (currentType) {
				case 'tasks':
					taskAndMindMaps.forEach((item) => {
						assignedData.tasks.push(
							...item.tasks.map((task) => ({
								id: task.id,
								title: task.title,
								emoji: task.emoji,
								workspaceId: task.workspaceId,
								link: `/dashboard/workspace/${task.workspaceId}/tasks/task/${task.id}`,
								workspaceName: item.name,
								createdAt: task.createdAt,
								type: 'task' as AssignedItemType,
								updated: {
									at: task.updatedAt,
									by: task.updatedBy,
								},
								starred: task.savedTask.length > 0,
							}))
						);
					});
					break;
				case 'mind-maps':
					taskAndMindMaps.forEach((item) => {
						assignedData.mindMaps.push(
							...item.mindMaps.map((mindMap) => ({
								id: mindMap.id,
								title: mindMap.title,
								emoji: mindMap.emoji,
								workspaceId: mindMap.workspaceId,
								link: `/dashboard/workspace/${mindMap.workspaceId}/mind-maps/mind-map/${mindMap.id}`,
								workspaceName: item.name,
								createdAt: mindMap.createdAt,
								type: 'mindMap' as AssignedItemType,
								updated: {
									at: mindMap.updatedAt,
									by: mindMap.updatedBy,
								},
								starred: mindMap.savedMindMaps.length > 0,
							}))
						);
					});
					break;

				default:
					taskAndMindMaps.forEach((item) => {
						assignedData.tasks.push(
							...item.tasks.map((task) => ({
								id: task.id,
								title: task.title,
								emoji: task.emoji,
								workspaceId: task.workspaceId,
								link: `/dashboard/workspace/${task.workspaceId}/tasks/task/${task.id}`,
								workspaceName: item.name,
								createdAt: task.createdAt,
								type: 'task' as AssignedItemType,
								updated: {
									at: task.updatedAt,
									by: task.updatedBy,
								},
								starred: task.savedTask.length > 0,
							}))
						);

						assignedData.mindMaps.push(
							...item.mindMaps.map((mindMap) => ({
								id: mindMap.id,
								title: mindMap.title,
								emoji: mindMap.emoji,
								workspaceId: mindMap.workspaceId,
								link: `/dashboard/workspace/${mindMap.workspaceId}/mind-maps/mind-map/${mindMap.id}`,
								workspaceName: item.name,
								createdAt: mindMap.createdAt,
								type: 'mindMap' as AssignedItemType,
								updated: {
									at: mindMap.updatedAt,
									by: mindMap.updatedBy,
								},
								starred: mindMap.savedMindMaps.length > 0,
							}))
						);
					});
					break;
			}

			return NextResponse.json(sortMindMapsAndTasksDataByUpdatedAt(assignedData), { status: 200 });
		}
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
};
