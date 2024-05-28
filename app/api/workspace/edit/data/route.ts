import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { apiWorkspaceEditData } from '@/schema/workspaceSchema';

export async function POST(request: Request) {
	const session = await getAuthSession();

	if (!session?.user) return NextResponse.json('ERRORS.UNAUTHORIZED', { status: 400 });

	const body: unknown = await request.json();
	const result = apiWorkspaceEditData.safeParse(body);

	if (!result.success) {
		return NextResponse.json('ERRORS.WRONG_DATA', { status: 401 });
	}

	const { id, color, workspaceName } = result.data;

	try {
		const user = await db.user.findUnique({
			where: {
				id: session.user.id,
			},
			include: {
				subscriptions: {
					where: {
						workspaceId: id,
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

		await db.workspace.update({
			where: {
				id,
			},
			data: {
				name: workspaceName,
				color,
			},
		});

		return NextResponse.json(result.data, { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
}
