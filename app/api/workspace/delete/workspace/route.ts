import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { apiWorkspaceDelete } from '@/schema/workspaceSchema';

export async function POST(request: Request) {
	const session = await getAuthSession();

	if (!session?.user) return NextResponse.json('ERRORS.UNAUTHORIZED', { status: 400 });

	const body: unknown = await request.json();

	const result = apiWorkspaceDelete.safeParse(body);

	if (!result.success) {
		return NextResponse.json('ERRORS.WRONG_DATA', { status: 401 });
	}
	const { id, workspaceName } = result.data;

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

		const workspace = await db.workspace.findUnique({
			where: {
				id,
			},
		});

		if (!workspace) return NextResponse.json('ERRORS.NO_WORKSPACE', { status: 404 });

		if (workspace.id === 'clufih8p50002ny8gj5iyx33p')
			return NextResponse.json('ERRORS.TEST_ACCOUNT_DELETE_WORKSPACE', { status: 400 });

		if (workspace.name !== workspaceName)
			return NextResponse.json('ERRORS.WRONG_WORKSPACE_NAME', { status: 403 });

		await db.workspace.delete({
			where: {
				id,
			},
		});

		return NextResponse.json('OK', { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
}
