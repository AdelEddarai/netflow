import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { z } from 'zod';

export async function POST(request: Request) {
	const session = await getAuthSession();

	if (!session?.user) return NextResponse.json('ERRORS.UNAUTHORIZED', { status: 400 });

	if (session.user.id === 'cluficg7w0000ny8gji6o5fi8')
		return NextResponse.json('ERRORS.TEST_ACCOUNT_DELETE_ACCOUNT', { status: 400 });

	const { email: userEmail } = session.user;

	const deleteAccountSchema = z.object({
		email: z
			.string()
			.email('SCHEMA.EMAIL')
			.refine((email) => email === userEmail, 'SCHEMA.EMAIL'),
	});

	const body: unknown = await request.json();
	const result = deleteAccountSchema.safeParse(body);

	if (!result.success) {
		return NextResponse.json('ERRORS.WRONG_DATA', { status: 401 });
	}

	try {
		const user = await db.user.findUnique({
			where: {
				id: session.user.id,
			},
		});

		if (!user) return NextResponse.json('ERRORS.NO_USER_API', { status: 404 });

		await db.user.delete({
			where: {
				id: user.id,
			},
		});

		return NextResponse.json('OK', { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
}
