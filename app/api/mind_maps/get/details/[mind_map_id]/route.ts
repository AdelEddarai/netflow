import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

interface Params {
	params: {
		mind_map_id: string;
	};
}

export const GET = async (request: Request, { params: { mind_map_id } }: Params) => {
	const url = new URL(request.url);
	const userId = url.searchParams.get('userId');

	if (!userId) return NextResponse.json('ERRORS.NO_USER_API', { status: 404 });
	try {
		const mindMap = await db.mindMap.findUnique({
			where: {
				id: mind_map_id,
			},
			include: {
				tags: true,
				savedMindMaps: true,
				creator: {
					select: {
						id: true,
						username: true,
						image: true,
						name: true,
						surname: true,
					},
				},
				updatedBy: {
					select: {
						id: true,
						username: true,
						image: true,
						name: true,
						surname: true,
					},
				},
				
			},
		});

		if (!mindMap) return NextResponse.json('mind map not found', { status: 404 });

		return NextResponse.json(mindMap, { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
};
