import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { z } from 'zod';
import { NotfiyType } from '@prisma/client';

export async function POST(request: Request) {
	const session = await getAuthSession();

	if (!session?.user) return NextResponse.json('ERRORS.UNAUTHORIZED', { status: 400 });

	const assignToTaskSchema = z.object({
		taskId: z.string(),
		workspaceId: z.string(),
		assignToUserId: z.string(),
	});

	const body: unknown = await request.json();
	const result = assignToTaskSchema.safeParse(body);

	if (!result.success) {
		return NextResponse.json('ERRORS.WRONG_DATA', { status: 401 });
	}

	const { taskId, workspaceId, assignToUserId } = result.data;

	try {
		const user = await db.user.findUnique({
			where: {
				id: session.user.id,
			},
			include: {
				subscriptions: {
					where: {
						workspaceId: workspaceId,
					},
					select: {
						userRole: true,
					},
				},
			},
		});

		if (!user) return NextResponse.json('ERRORS.NO_USER_API', { status: 404 });

		if (user.subscriptions[0].userRole === 'READ_ONLY')
			return NextResponse.json('ERRORS.NO_PERMISSION', { status: 403 });

		const assigningUser = await db.user.findUnique({
			where: {
				id: assignToUserId,
			},
			include: {
				assignedToTask: {
					where: {
						taskId,
					},
				},
			},
		});

		if (!assignToUserId) return NextResponse.json('ERRORS.USER_NO_EXIST', { status: 4054 });

		if (!assigningUser?.assignedToTask || assigningUser?.assignedToTask.length === 0) {
			await db.assignedToTask.create({
				data: {
					userId: assignToUserId,
					taskId,
				},
			});
			if (assignToUserId !== session.user.id)
				await db.notification.create({
					data: {
						notifayCreatorId: session.user.id,
						userId: assignToUserId,
						notfiyType: NotfiyType.NEW_ASSIGMENT_TASK,
						workspaceId,
						taskId,
					},
				});

			return NextResponse.json('OK', { status: 200 });
		} else {
			await db.assignedToTask.delete({
				where: {
					id: assigningUser.assignedToTask[0].id,
				},
			});

			if (assigningUser.assignedToTask[0].id !== session.user.id)
				await db.notification.deleteMany({
					where: {
						notifayCreatorId: session.user.id,
						userId: assignToUserId,
						notfiyType: NotfiyType.NEW_ASSIGMENT_TASK,
						workspaceId,
						taskId,
					},
				});

			return NextResponse.json('OK', { status: 200 });
		}
	} catch (err) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
}
