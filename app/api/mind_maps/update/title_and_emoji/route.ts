import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { updateTitleAndEmojiSchema } from '@/schema/mindMapSchema';

export async function POST(request: Request) {
	const session = await getAuthSession();

	if (!session?.user) return NextResponse.json('ERRORS.UNAUTHORIZED', { status: 400 });

	const body: unknown = await request.json();
	const result = updateTitleAndEmojiSchema.safeParse(body);

	if (!result.success) {
		result.error;
		return NextResponse.json('ERRORS.WRONG_DATA', { status: 401 });
	}

	const { icon, mapId, title, workspaceId } = result.data;

	try {
		const user = await db.user.findUnique({
			where: {
				id: session.user.id,
			},
			include: {
				subscriptions: {
					where: {
						workspaceId: workspaceId,
					},
					select: {
						userRole: true,
					},
				},
			},
		});

		if (!user) return NextResponse.json('ERRORS.NO_USER_API', { status: 404 });

		if (user.subscriptions[0].userRole === 'READ_ONLY')
			return NextResponse.json('ERRORS.NO_PERMISSION', { status: 403 });

		const mindMap = await db.mindMap.findUnique({
			where: {
				id: mapId,
			},
		});
		if (!mindMap) return NextResponse.json('ERRORS.NO_MIND_MAP_FOUND', { status: 404 });

		const updatedmindMap = await db.mindMap.update({
			where: {
				id: mindMap.id,
			},
			data: {
				updatedUserId: session.user.id,
				emoji: icon,
				title,
			},
		});

		return NextResponse.json(updatedmindMap, { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
}
