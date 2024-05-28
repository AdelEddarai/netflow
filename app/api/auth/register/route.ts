import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { signUpSchema } from '@/schema/signUpSchema';

export async function POST(request: Request) {
	const body: unknown = await request.json();
	const result = signUpSchema.safeParse(body);

	if (!result.success) {
		return NextResponse.json('ERRORS.WRONG_DATA', { status: 203 });
	}

	const { email, password, username } = result.data;

	try {
		const existedUsername = await db.user.findUnique({
			where: {
				username,
			},
		});

		if (existedUsername) return NextResponse.json('ERRORS.TAKEN_USERNAME', { status: 202 });

		const existedUser = await db.user.findUnique({
			where: {
				email,
			},
		});

		if (existedUser) return NextResponse.json('ERRORS.TAKEN_EMAIL', { status: 201 });

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await db.user.create({
			data: {
				username,
				email,
				hashedPassword,
			},
		});

		return NextResponse.json(newUser, { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 204 });
	}
}
