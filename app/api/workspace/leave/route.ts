import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { z } from 'zod';
import { NotfiyType } from '@prisma/client';

export async function POST(request: Request) {
	const session = await getAuthSession();

	if (!session?.user) return NextResponse.json('ERRORS.UNAUTHORIZED', { status: 400 });

	const body: unknown = await request.json();
	const result = z
		.object({
			id: z.string(),
		})
		.safeParse(body);

	if (!result.success) {
		return NextResponse.json('ERRORS.WRONG_DATA', { status: 401 });
	}

	const { id } = result.data;

	try {
		const user = await db.user.findUnique({
			where: {
				id: session.user.id,
			},
			include: {
				subscriptions: {
					where: {
						workspaceId: id,
					},
					select: {
						userRole: true,
					},
				},
				savedMindMaps: {
					where: {
						mindMap: {
							workspaceId: id,
						},
					},
				},
				savedTask: {
					where: {
						task: {
							workspaceId: id,
						},
					},
				},
				assignedToMindMap: {
					where: {
						mindMap: {
							workspaceId: id,
						},
					},
				},
				assignedToTask: {
					where: {
						task: {
							workspaceId: id,
						},
					},
				},
			},
		});

		if (!user) return NextResponse.json('ERRORS.NO_USER_API', { status: 404 });

		if (user.subscriptions[0].userRole === 'OWNER')
			return NextResponse.json('ERRORS.CANT_LEAVE', { status: 403 });

		const savedMindMapsIds = user.savedMindMaps.map((mindMap) => mindMap.id);
		const savedTasksIds = user.savedTask.map((task) => task.id);

		const assignedToMindMapIds = user.assignedToMindMap.map((mindMap) => mindMap.id);
		const assignedToTaskIds = user.assignedToTask.map((task) => task.id);

		await db.savedMindMaps.deleteMany({
			where: {
				id: { in: savedMindMapsIds },
			},
		});

		await db.savedTask.deleteMany({
			where: {
				id: { in: savedTasksIds },
			},
		});

		await db.assignedToMindMap.deleteMany({
			where: {
				id: { in: assignedToMindMapIds },
			},
		});

		await db.assignedToTask.deleteMany({
			where: {
				id: { in: assignedToTaskIds },
			},
		});

		await db.subscription.delete({
			where: {
				userId_workspaceId: {
					workspaceId: id,
					userId: session.user.id,
				},
			},
		});

		const workspaceUsers = await db.subscription.findMany({
			where: {
				workspaceId: id,
			},
			select: {
				userId: true,
			},
		});

		const notificationsData = workspaceUsers.map((user) => ({
			notifayCreatorId: session.user.id,
			userId: user.userId,
			workspaceId: id,
			notfiyType: NotfiyType.USER_LEFT_WORKSPACE,
		}));

		await db.notification.createMany({
			data: notificationsData,
		});

		return NextResponse.json('ok', { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
}
