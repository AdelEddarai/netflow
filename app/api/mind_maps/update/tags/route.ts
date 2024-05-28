import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { updateMindMaPActiveTagsSchema } from '@/schema/mindMapSchema';

export async function POST(request: Request) {
	const session = await getAuthSession();

	if (!session?.user) return NextResponse.json('ERRORS.UNAUTHORIZED', { status: 400 });

	const body: unknown = await request.json();
	const result = updateMindMaPActiveTagsSchema.safeParse(body);

	if (!result.success) {
		return NextResponse.json('ERRORS.WRONG_DATA', { status: 401 });
	}

	const { tagsIds, mindMapId, workspaceId } = result.data;

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
				id: mindMapId,
			},
			include: {
				tags: true,
			},
		});
		if (!mindMap) return NextResponse.json('ERRORS.NO_MIND_MAP_FOUND', { status: 404 });

		const updatedMindMap = await db.mindMap.update({
			where: {
				id: mindMap.id,
			},
			data: {
				updatedUserId: session.user.id,
				tags: {
					connect: tagsIds.map((tagId) => ({ id: tagId })),
					disconnect: mindMap.tags.filter((existingTag) => !tagsIds.includes(existingTag.id)),
				},
			},
		});

		return NextResponse.json(updatedMindMap, { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
}
