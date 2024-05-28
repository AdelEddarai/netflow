import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { deleteTaskSchema } from '@/schema/taskSchema';
import { NotfiyType } from '@prisma/client';

export async function POST(request: Request) {
	const session = await getAuthSession();

	if (!session?.user) return NextResponse.json('ERRORS.UNAUTHORIZED', { status: 400 });

	const body: unknown = await request.json();
	const result = deleteTaskSchema.safeParse(body);

	if (!result.success) {
		return NextResponse.json('ERRORS.WRONG_DATA', { status: 401 });
	}

	const { workspaceId, taskId } = result.data;

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

		const task = await db.task.findUnique({
			where: {
				id: taskId,
			},
			include: {
				taskDate: true,
			},
		});

		if (!task) return NextResponse.json('ERRORS.NO_TASK_FOUND', { status: 404 });

		await db.task.delete({
			where: {
				id: task.id,
			},
		});

		await db.notification.deleteMany({
			where: {
				workspaceId,
				taskId: task.id,
				notfiyType: NotfiyType.NEW_TASK,
			},
		});

		return NextResponse.json('ok', { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
}
