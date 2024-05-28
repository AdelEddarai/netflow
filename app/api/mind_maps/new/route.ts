import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { z } from 'zod';
import { NotfiyType } from '@prisma/client';

export async function POST(request: Request) {
	const session = await getAuthSession();

	if (!session?.user) return NextResponse.json('ERRORS.UNAUTHORIZED', { status: 400 });

	const newMindMapSchema = z.object({
		workspaceId: z.string(),
	});

	const body: unknown = await request.json();
	const result = newMindMapSchema.safeParse(body);

	if (!result.success) {
		return NextResponse.json('ERRORS.WRONG_DATA', { status: 401 });
	}

	const { workspaceId } = result.data;

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

		const mindMap = await db.mindMap.create({
			data: {
				workspaceId,
				creatorId: session.user.id,
				title: '',
			},
		});

		await db.mindMap.update({
			where: {
				id: mindMap.id,
			},
			data: {
				updatedUserId: session.user.id,
			},
		});

		const workspaceUsers = await db.subscription.findMany({
			where: {
				workspaceId,
			},
			select: {
				userId: true,
			},
		});

		const notificationsData = workspaceUsers.map((user) => ({
			notifayCreatorId: session.user.id,
			userId: user.userId,
			workspaceId,
			notfiyType: NotfiyType.NEW_MIND_MAP,
			mindMapId: mindMap.id,
		}));
		const filterNotificationsData = notificationsData.filter(
			(data) => data.userId !== session.user.id
		);

		await db.notification.createMany({
			data: filterNotificationsData,
		});

		return NextResponse.json(mindMap, { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
}
