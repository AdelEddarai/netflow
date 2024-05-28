import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { pomodoroSettingsSchema } from '@/schema/pomodoroSettingsSchema';
import { id } from 'date-fns/locale';
import { PomodoroSoundEffect } from '@prisma/client';

export async function POST(request: Request) {
	const session = await getAuthSession();

	if (!session?.user) return NextResponse.json('ERRORS.UNAUTHORIZED', { status: 400 });

	const body: unknown = await request.json();
	const result = pomodoroSettingsSchema.safeParse(body);

	if (!result.success) {
		result.error;
		return NextResponse.json('ERRORS.WRONG_DATA', { status: 401 });
	}

	const {
		longBreakDuration,
		longBreakInterval,
		rounds,
		shortBreakDuration,
		workDuration,
		soundEffect,
		soundEffectVloume,
	} = result.data;

	try {
		const user = await db.user.findUnique({
			where: {
				id: session.user.id,
			},
			include: {
				pomodoroSettings: {
					select: {
						userId: true,
						id: true,
					},
				},
			},
		});

		if (!user) return NextResponse.json('ERRORS.NO_USER_API', { status: 404 });

		const pomodoro = user.pomodoroSettings.find((settings) => settings.userId === user.id);

		if (!pomodoro) {
			await db.pomodoroSettings.create({
				data: {
					userId: user.id,
					longBreakDuration,
					longBreakInterval,
					rounds,
					shortBreakDuration,
					workDuration,
					soundEffect: soundEffect as PomodoroSoundEffect,
					soundEffectVloume: soundEffectVloume / 100,
				},
			});

			return NextResponse.json('OK', { status: 200 });
		} else {
			await db.pomodoroSettings.update({
				where: {
					id: pomodoro.id,
				},
				data: {
					longBreakDuration,
					longBreakInterval,
					rounds,
					shortBreakDuration,
					workDuration,
					soundEffect: soundEffect as PomodoroSoundEffect,
					soundEffectVloume: soundEffectVloume / 100,
				},
			});

			return NextResponse.json('OK', { status: 200 });
		}
	} catch (err) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
}
