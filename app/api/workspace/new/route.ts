import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { apiWorkspaceSchema } from '@/schema/workspaceSchema';
import { MAX_USER_WORKSPACES } from '@/lib/options';
import { getRandomWorkspaceColor } from '@/lib/getRandomWorkspaceColor';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
	const session = await getAuthSession();

	if (!session?.user) return NextResponse.json('ERRORS.UNAUTHORIZED', { status: 400 });

	const body: unknown = await request.json();
	const result = apiWorkspaceSchema.safeParse(body);

	if (!result.success) {
		return NextResponse.json('ERRORS.WRONG_DATA', { status: 401 });
	}

	const { workspaceName, file } = result.data;

	try {
		const user = await db.user.findUnique({
			where: {
				id: session.user.id,
			},
			include: {
				createdWorkspaces: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		if (!user) return NextResponse.json('ERRORS.NO_USER_API', { status: 404 });

		if (user.createdWorkspaces.length === MAX_USER_WORKSPACES) {
			return NextResponse.json('ERRORS.TOO_MANY_WORKSPACES', { status: 402 });
		}

		const theSameWorksapceName = user.createdWorkspaces.find(
			(workspace) => workspace.name.toLowerCase() === workspaceName.toLowerCase()
		);

		if (theSameWorksapceName)
			return NextResponse.json('ERRORS.SAME_NAME_WORKSPACE', { status: 403 });

		const color = getRandomWorkspaceColor();
		const workspace = await db.workspace.create({
			data: {
				creatorId: user.id,
				name: workspaceName,
				inviteCode: uuidv4(),
				adminCode: uuidv4(),
				canEditCode: uuidv4(),
				readOnlyCode: uuidv4(),
				image: file,
				color,
			},
		});

		await db.subscription.create({
			data: {
				userId: user.id,
				workspaceId: workspace.id,
				userRole: 'OWNER',
			},
		});

		const conversation = await db.conversation.create({
			data: {
				workspaceId: workspace.id,
			},
		});

		return NextResponse.json(workspace, { status: 200 });
	} catch (_) {
		return NextResponse.json('ERRORS.DB_ERROR', { status: 405 });
	}
}
