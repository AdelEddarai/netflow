import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const url = new URL(request.url);
	const workspaceId = url.searchParams.get('workspaceId');

	if (!workspaceId) return NextResponse.json('ERRORS.NO_WORKSPACE', { status: 404 });

	try {
		const users = await db.user.findMany({
			where: {
				subscriptions: {
					some: { workspaceId },
				},
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

		const returnUsers = users.map((user) => {
			return {
				id: user.id,
				username: user.username,
				image: user.image,
				userRole: user.subscriptions[0].userRole,
			};
		});

		return NextResponse.json(returnUsers, { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
}
