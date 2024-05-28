import { db } from '@/lib/db';
import { CalendarItem } from '@/types/extended';
import { NextResponse } from 'next/server';

export const GET = async (request: Request) => {
	const url = new URL(request.url);
	const userId = url.searchParams.get('userId');

	if (!userId) return NextResponse.json('ERRORS.WRONG_DATA', { status: 404 });
	try {
		const userSubscriptions = await db.subscription.findMany({
			where: {
				userId: userId,
			},
			include: {
				workspace: {
					include: {
						tasks: {
							include: {
								taskDate: true,
							},
						},
					},
				},
			},
		});

		if (userSubscriptions.length === 0) return NextResponse.json([], { status: 200 });

		const allTasks: CalendarItem[] = userSubscriptions.flatMap((subscription) => {
			return subscription.workspace.tasks.map((task) => ({
				title: task.title,
				taskDate: task.taskDate?.from
					? {
							id: task.taskDate.id,
							from: task.taskDate.from ? new Date(task.taskDate.from) : undefined,
							to: task.taskDate.to ? new Date(task.taskDate.to) : undefined,
					  }
					: null,
				workspaceId: subscription.workspace.id,
				workspaceName: subscription.workspace.name,
				workspaceColor: subscription.workspace.color,
				taskId: task.id,
			}));
		});

		return NextResponse.json(allTasks, { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
};
