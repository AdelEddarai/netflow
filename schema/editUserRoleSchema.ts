import { z } from 'zod';

export const editUserRoleSchema = z.object({
	userId: z.string(),
	workspaceId: z.string(),
	newRole: z.enum(['ADMIN', 'CAN_EDIT', 'READ_ONLY']),
});

export type EditUserRoleSchema = z.infer<typeof editUserRoleSchema>;
