import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { accountInfoSettingsSchema } from '@/schema/accountInfoSettingsSchema';

export async function POST(request: Request) {
	const session = await getAuthSession();

	if (!session?.user) return NextResponse.json('ERRORS.UNAUTHORIZED', { status: 400 });

	const body: unknown = await request.json();
	const result = accountInfoSettingsSchema.safeParse(body);

	if (!result.success) {
		return NextResponse.json('ERRORS.WRONG_DATA', { status: 401 });
	}

	const { username, name, surname } = result.data;

	try {
		const user = await db.user.findUnique({
			where: {
				id: session.user.id,
			},
		});

		if (!user) return NextResponse.json('ERRORS.NO_USER_API', { status: 404 });

		const existedUsername = await db.user.findUnique({
			where: {
				username,
			},
		});

		if (existedUsername && existedUsername.id!==user.id) return NextResponse.json('ERRORS.TAKEN_USERNAME', { status: 402 });

		await db.user.update({
			where: {
				id: user.id,
			},
			data: {
				name,
				username,
				surname,
			},
		});

		return NextResponse.json(result.data, { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
}
