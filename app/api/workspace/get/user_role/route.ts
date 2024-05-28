import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const url = new URL(request.url);
	const userId = url.searchParams.get('userId');
	const workspaceId = url.searchParams.get('workspaceId');

	if (!userId || !workspaceId) return NextResponse.json('ERRORS.NO_USER_API', { status: 404 });

	try {
		const user = await db.user.findUnique({
			where: {
				id: userId,
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

		const userRole = user.subscriptions[0].userRole;

		return NextResponse.json(userRole, { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
}
