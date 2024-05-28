import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { newMessageSchema } from '@/schema/messageSchema';

export async function POST(request: Request) {
	const session = await getAuthSession();

	if (!session?.user) return NextResponse.json('ERRORS.UNAUTHORIZED', { status: 400 });

	const body: unknown = await request.json();

	const result = newMessageSchema.safeParse(body);

	if (!result.success) {
		return NextResponse.json('ERRORS.WRONG_DATA', { status: 401 });
	}

	const newMessage = result.data;

	if (newMessage.content.length === 0 && newMessage.aditionalRecources.length === 0)
		return NextResponse.json('ERRORS.WRONG_DATA', { status: 401 });

	try {
		const chat = await db.conversation.findUnique({
			where: { id: newMessage.conversationId },
		});
		if (!chat) return NextResponse.json('ERRORS.NO_CHAT', { status: 404 });

		await db.message.create({
			data: {
				id: newMessage.id,
				senderId: newMessage.senderId,
				content: newMessage.content,
				conversationId: newMessage.conversationId,
				edited: false,
			},
		});
		if (newMessage.aditionalRecources.length > 0) {
			for (const attachment of newMessage.aditionalRecources) {
				await db.aditionalRecource.create({
					data: {
						messageId: newMessage.id,
						name: attachment.name,
						url: attachment.url,
						type: attachment.type,
					},
				});
			}
		}
		return NextResponse.json('ok', { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
}
