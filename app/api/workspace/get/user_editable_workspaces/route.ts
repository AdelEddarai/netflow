import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const GET = async (request: Request) => {
	const url = new URL(request.url);
	const userId = url.searchParams.get('userId');

	if (!userId) return NextResponse.json('ERRORS.NO_USER_API', { status: 404 });
	try {
		const subscritions = await db.subscription.findMany({
			where: {
				userId,
				NOT: { userRole: 'READ_ONLY' },
			},
			include: {
				workspace: true,
			},
		});

		const workspace = subscritions.map((subscrition) => subscrition.workspace);

		if (!workspace) return NextResponse.json([], { status: 200 });
		return NextResponse.json(workspace, { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
};
