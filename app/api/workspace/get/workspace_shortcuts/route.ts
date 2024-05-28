import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const GET = async (request: Request) => {
	const url = new URL(request.url);
	const workspaceId = url.searchParams.get('workspaceId');

	if (!workspaceId) return NextResponse.json('ERRORS.NO_WORKSPACE', { status: 404 });
	try {
		const workspaceShortcuts = await db.workspace.findUnique({
			where: {
				id: workspaceId,
			},

			include: {
				tasks: {
					select: {
						emoji: true,
						title: true,
						id: true,
					},
				},
				mindMaps: {
					select: {
						id: true,
						title: true,
						emoji: true,
					},
				},
			},
		});

		if (!workspaceShortcuts) return NextResponse.json('not found', { status: 404 });
		return NextResponse.json(workspaceShortcuts, { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
};
