import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const GET = async (request: Request) => {
	const url = new URL(request.url);
	const workspaceId = url.searchParams.get('workspaceId');
	const mindMapId = url.searchParams.get('mindMapId');

	if (!workspaceId || !mindMapId) return NextResponse.json('ERRORS.WRONG_DATA', { status: 404 });
	try {
		const users = await db.workspace.findUnique({
			where: {
				id: workspaceId,
			},
			include: {
				subscribers: {
					select: {
						user: {
							select: {
								id: true,
								username: true,
								image: true,
								assignedToMindMap: {
									select: {
										userId: true,
									},
									where: {
										mindMapId,
									},
								},
							},
						},
					},
				},
			},
		});

		if (!users) return NextResponse.json([], { status: 200 });
		return NextResponse.json(users, { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
};
