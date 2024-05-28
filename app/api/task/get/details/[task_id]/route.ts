import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

interface Params {
	params: {
		task_id: string;
	};
}

export const GET = async (request: Request, { params: { task_id } }: Params) => {
	const url = new URL(request.url);
	const userId = url.searchParams.get('userId');

	if (!userId) return NextResponse.json('ERRORS.NO_USER_API', { status: 404 });
	try {
		const task = await db.task.findUnique({
			where: {
				id: task_id,
			},
			include: {
				tags: true,
				taskDate: true,
				savedTask: true,
				creator: {
					select: {
						id: true,
						username: true,
						image: true,
						name: true,
						surname: true,
					},
				},
				updatedBy: {
					select: {
						id: true,
						username: true,
						image: true,
						name: true,
						surname: true,
					},
				},
			},
		});

		if (!task) return NextResponse.json('task not found', { status: 404 });

		return NextResponse.json(task, { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
};
