import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { deleteUserFromWorkspaceSchema } from '@/schema/deleteUserFromWorkspaceSchema';
import { NotfiyType } from '@prisma/client';

export async function POST(request: Request) {
	const session = await getAuthSession();

	if (!session?.user) return NextResponse.json('ERRORS.UNAUTHORIZED', { status: 400 });

	const body: unknown = await request.json();
	const result = deleteUserFromWorkspaceSchema.safeParse(body);

	if (!result.success) {
		return NextResponse.json('ERRORS.WRONG_DATA', { status: 401 });
	}

	const { userId, workspaceId } = result.data;

	try {
		const user = await db.user.findUnique({
			where: {
				id: session.user.id,
			},
			include: {
				subscriptions: {
					where: {
						workspaceId,
					},
					select: {
						userRole: true,
					},
				},
			},
		});

		if (!user) return NextResponse.json('ERRORS.NO_USER_API', { status: 404 });

		if (
			user.subscriptions[0].userRole === 'CAN_EDIT' ||
			user.subscriptions[0].userRole === 'READ_ONLY'
		)
			return NextResponse.json('ERRORS.NO_PERMISSION', { status: 403 });
		await db.subscription.delete({
			where: {
				userId_workspaceId: {
					userId,
					workspaceId,
				},
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
			notifayCreatorId: userId,
			userId: user.userId,
			workspaceId,
			notfiyType: NotfiyType.USER_LEFT_WORKSPACE,
		}));

		await db.notification.createMany({
			data: notificationsData,
		});

		return NextResponse.json('OK', { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
}
