import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const GET = async (request: Request) => {
	const url = new URL(request.url);
	const userId = url.searchParams.get('userId');

	if (!userId) return NextResponse.json('ERRORS.NO_USER_API', { status: 404 });
	try {
		const userNotifications = await db.notification.findMany({
			where: {
				userId,
			},
			include: {
				notifayCreator: {
					select: {
						id: true,
						username: true,
						image: true,
					},
				},
				workspace: {
					select: {
						id: true,
						name: true,
					},
				},
			},
			orderBy: {
				createdDate: 'desc',
			},
		});

		if (!userNotifications) return NextResponse.json('ERRORS.NO_USER_API', { status: 404 });

		return NextResponse.json(userNotifications, { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
};
