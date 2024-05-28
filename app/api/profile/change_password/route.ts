import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { changePasswordSchema } from '@/schema/changePasswordSchema';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
	const session = await getAuthSession();

	if (!session?.user) return NextResponse.json('ERRORS.UNAUTHORIZED', { status: 400 });

	if (session.user.id === 'cluficg7w0000ny8gji6o5fi8')
		return NextResponse.json('ERRORS.TEST_ACCOUNT_RESET_PASSWORD', { status: 400 });

	const body: unknown = await request.json();
	const result = changePasswordSchema.safeParse(body);

	if (!result.success) {
		return NextResponse.json('ERRORS.WRONG_DATA', { status: 401 });
	}

	const { new_password, current_password } = result.data;

	try {
		const user = await db.user.findUnique({
			where: {
				id: session.user.id,
			},
		});

		if (!user) return NextResponse.json('ERRORS.NO_USER_API', { status: 404 });

		if (!user.hashedPassword) return NextResponse.json('ERRORS.NO_PASSWORD', { status: 406 });

		const passwordMatch = await bcrypt.compare(current_password, user.hashedPassword);
		if (!passwordMatch) return NextResponse.json('ERRORS.PASSWORD_DISMATCH', { status: 402 });

		const hashedPassword = await bcrypt.hash(new_password, 10);

		const updatedUser = await db.user.update({
			where: {
				id: user.id,
			},
			data: {
				hashedPassword,
			},
		});

		return NextResponse.json(updatedUser, { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
}
