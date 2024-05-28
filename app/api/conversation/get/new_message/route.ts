import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const GET = async (request: Request) => {
	const url = new URL(request.url);

	const messageId = url.searchParams.get('messageId');

	if (!messageId) return NextResponse.json('ERRORS.WRONG_DATA', { status: 404 });

	try {
		const message = await db.message.findUnique({
			where: {
				id: messageId,
			},
			include: {
				aditionalRecources: {
					select: {
						id: true,
						message: true,
						name: true,
						type: true,
						url: true,
					},
				},
				sender: {
					select: {
						id: true,
						username: true,
						image: true,
					},
				},
			},
		});

		if (!message) return NextResponse.json('ERRORS.NO_MESSAGE', { status: 404 });

		return NextResponse.json(message, {
			status: 200,
		});
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
};
