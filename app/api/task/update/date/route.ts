import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { updateTaskDateSchema } from '@/schema/updateTaskSchema';

export async function POST(request: Request) {
	const session = await getAuthSession();

	if (!session?.user) return NextResponse.json('ERRORS.UNAUTHORIZED', { status: 400 });

	const body: unknown = await request.json();
	const result = updateTaskDateSchema.safeParse(body);
	body;

	if (!result.success) {
		result.error;
		return NextResponse.json('ERRORS.WRONG_DATA', { status: 401 });
	}

	const { date, taskId, workspaceId } = result.data;

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

		await db.taskDate.update({
			where: {
				id: task.taskDate?.id,
			},
			data: {
				from: date?.from ? date.from : null,
				to: date?.to ? date.to : null,
			},
		});

		const updatedTask = await db.task.update({
			where: {
				id: task.id,
			},
			data: {
				updatedUserId: session.user.id,
			},
		});

		return NextResponse.json(updatedTask, { status: 200 });
	} catch (err) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
}
