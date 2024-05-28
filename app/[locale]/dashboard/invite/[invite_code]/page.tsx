import { checkIfUserCompletedOnboarding } from '@/lib/checkIfUserCompletedOnboarding';
import { db } from '@/lib/db';
import { NotfiyType } from '@prisma/client';
import { Metadata } from 'next';
import { redirect } from 'next-intl/server';
import { notFound } from 'next/navigation';

interface Params {
	params: {
		invite_code: string;
	};
	searchParams: {
		[key: string]: string | undefined;
	};
}

interface InviteCodeValidWhere {
	inviteCode: string;
	adminCode?: string;
	readOnlyCode?: string;
	canEditCode?: string;
}

export const metadata: Metadata = {
	title: 'StudyFlow - Join to workspace',
	description:
		"You've been invited to join a new workspace! Dive into a collaborative environment where you can streamline tasks, communicate effectively, and achieve your goals alongside fellow team members. Welcome aboard!",
};

const Workspace = async ({ params: { invite_code }, searchParams }: Params) => {
	const session = await checkIfUserCompletedOnboarding();

	const role = searchParams.role as 'editor' | 'admin' | 'viewer' | null | undefined;
	const shareCode = searchParams.shareCode;

	if (!role || !shareCode || !invite_code) notFound();

	if (role !== 'admin' && role !== 'editor' && role !== 'viewer') notFound();

	let inviteCodeValidWhere: InviteCodeValidWhere = {
		inviteCode: invite_code,
	};

	switch (role) {
		case 'admin': {
			inviteCodeValidWhere = {
				...inviteCodeValidWhere,
				adminCode: shareCode,
			};
			break;
		}

		case 'editor': {
			inviteCodeValidWhere = {
				...inviteCodeValidWhere,
				canEditCode: shareCode,
			};
			break;
		}
		case 'viewer': {
			inviteCodeValidWhere = {
				...inviteCodeValidWhere,
				readOnlyCode: shareCode,
			};
			break;
		}
	}

	const inviteCodeValid = await db.workspace.findUnique({
		where: {
			...inviteCodeValidWhere,
		},
	});

	if (!inviteCodeValid) notFound();

	const existingWorkspace = await db.workspace.findFirst({
		where: {
			inviteCode: invite_code,
			subscribers: {
				some: {
					userId: session.user.id,
				},
			},
		},
	});

	if (existingWorkspace) redirect(`/dashboard/workspace/${existingWorkspace.id}`);

	const userRole = () => {
		switch (role) {
			case 'admin':
				return 'ADMIN';
			case 'editor':
				return 'CAN_EDIT';
			case 'viewer':
				return 'READ_ONLY';
		}
	};

	const workspaceUsers = await db.subscription.findMany({
		where: {
			workspaceId: inviteCodeValid.id,
		},
		select: {
			userId: true,
		},
	});

	const notificationsData = workspaceUsers.map((user) => ({
		notifayCreatorId: session.user.id,
		userId: user.userId,
		workspaceId: inviteCodeValid.id,
		notfiyType: NotfiyType.NEW_USER_IN_WORKSPACE,
	}));

	await db.notification.createMany({
		data: notificationsData,
	});

	await db.subscription.create({
		data: {
			userId: session.user.id,
			workspaceId: inviteCodeValid.id,
			userRole: userRole(),
		},
	});

	redirect(`/dashboard/workspace/${inviteCodeValid.id}`);
};
export default Workspace;
