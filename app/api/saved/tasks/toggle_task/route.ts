import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { z } from 'zod';

export async function POST(request: Request) {
	const session = await getAuthSession();

	if (!session?.user) return NextResponse.json('ERRORS.UNAUTHORIZED', { status: 400 });

	const taskSchema = z.object({
		taskId: z.string(),
	});

	const body: unknown = await request.json();
	const result = taskSchema.safeParse(body);

	if (!result.success) {
		return NextResponse.json('ERRORS.WRONG_DATA', { status: 401 });
	}

	const { taskId } = result.data;

	try {
		const user = await db.user.findUnique({
			where: {
				id: session.user.id,
			},
			include: {
				savedTask: true,
			},
		});

		if (!user) return NextResponse.json('ERRORS.NO_USER_API', { status: 404 });

		const existSavedTask = user.savedTask.find((task) => task.taskId === taskId);

		if (existSavedTask) {
			await db.savedTask.delete({
				where: {
					id: existSavedTask.id,
				},
			});
		} else {
			await db.savedTask.create({
				data: {
					user: { connect: { id: session.user.id } },
					task: { connect: { id: taskId } },
				},
			});
		}

		return NextResponse.json('ok', { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
}
