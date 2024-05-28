import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { z } from 'zod';

export async function POST(request: Request) {
	const session = await getAuthSession();

	if (!session?.user) return NextResponse.json('ERRORS.UNAUTHORIZED', { status: 400 });

	const taskSchema = z.object({
		mindMapId: z.string(),
	});

	const body: unknown = await request.json();
	const result = taskSchema.safeParse(body);

	if (!result.success) {
		return NextResponse.json('ERRORS.WRONG_DATA', { status: 401 });
	}

	const { mindMapId } = result.data;

	try {
		const user = await db.user.findUnique({
			where: {
				id: session.user.id,
			},
			include: {
				savedMindMaps: true,
			},
		});

		if (!user) return NextResponse.json('ERRORS.NO_USER_API', { status: 404 });

		const existSavedMindMap = user.savedMindMaps.find((mindMap) => mindMap.mindMapId === mindMapId);

		if (existSavedMindMap) {
			await db.savedMindMaps.delete({
				where: {
					id: existSavedMindMap.id,
				},
			});
		} else {
			await db.savedMindMaps.create({
				data: {
					user: { connect: { id: session.user.id } },
					mindMap: { connect: { id: mindMapId } },
				},
			});
		}

		return NextResponse.json('ok', { status: 200 });
	} catch (err) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
}
