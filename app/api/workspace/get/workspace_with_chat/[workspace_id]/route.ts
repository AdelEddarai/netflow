import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

interface Params {
	params: {
		workspace_id: string;
	};
}

export const GET = async (request: Request, { params: { workspace_id } }: Params) => {
	const url = new URL(request.url);
	const userId = url.searchParams.get('userId');

	if (!userId) return NextResponse.json('ERRORS.NO_USER_API', { status: 404 });
	try {
		const workspace = await db.workspace.findUnique({
			where: {
				id: workspace_id,
				subscribers: {
					some: {
						userId,
					},
				},
			},
			include: {
				conversation: {
					where: {
						workspaceId: workspace_id,
					},
					select: {
						id: true,
					},
				},
			},
		});

		if (!workspace) return NextResponse.json('Workspace not found', { status: 404 });

		return NextResponse.json(workspace, { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
};
