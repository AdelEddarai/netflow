import { z } from 'zod';

export const deleteUserFromWorkspaceSchema = z.object({
	userId: z.string(),
	workspaceId: z.string(),
});

export type DeleteUserFromWorkspaceSchema = z.infer<typeof deleteUserFromWorkspaceSchema>;
