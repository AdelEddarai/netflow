import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { z } from 'zod';
import { NotfiyType } from '@prisma/client';

export async function POST(request: Request) {
	const session = await getAuthSession();

	if (!session?.user) return NextResponse.json('ERRORS.UNAUTHORIZED', { status: 400 });

	const assignToMindMapSchema = z.object({
		mindMapId: z.string(),
		workspaceId: z.string(),
		assignToUserId: z.string(),
	});

	const body: unknown = await request.json();
	const result = assignToMindMapSchema.safeParse(body);

	if (!result.success) {
		return NextResponse.json('ERRORS.WRONG_DATA', { status: 401 });
	}

	const { mindMapId, workspaceId, assignToUserId } = result.data;

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
				assignedToMindMap: {
					where: {
						mindMapId,
					},
				},
			},
		});

		if (!assignToUserId) return NextResponse.json('ERRORS.USER_NO_EXIST', { status: 4054 });

		if (!assigningUser?.assignedToMindMap || assigningUser?.assignedToMindMap.length === 0) {
			await db.assignedToMindMap.create({
				data: {
					userId: assignToUserId,
					mindMapId,
				},
			});

			if (assignToUserId !== session.user.id)
				await db.notification.create({
					data: {
						notifayCreatorId: session.user.id,
						userId: assignToUserId,
						notfiyType: NotfiyType.NEW_ASSIGMENT_MIND_MAP,
						workspaceId,
						mindMapId,
					},
				});

			return NextResponse.json('OK', { status: 200 });
		} else {
			await db.assignedToMindMap.delete({
				where: {
					id: assigningUser.assignedToMindMap[0].id,
				},
			});

			if (assigningUser.assignedToMindMap[0].id !== session.user.id)
				await db.notification.deleteMany({
					where: {
						notifayCreatorId: session.user.id,
						userId: assigningUser.assignedToMindMap[0].id,
						notfiyType: NotfiyType.NEW_ASSIGMENT_MIND_MAP,
						workspaceId,
						mindMapId,
					},
				});

			return NextResponse.json('OK', { status: 200 });
		}
	} catch (err) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
}
