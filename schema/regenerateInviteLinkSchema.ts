import { z } from 'zod';

export const regenerateInviteLinkSchema = z.object({
	id: z.string(),
});

export type RegenerateInviteLinkSchema = z.infer<typeof regenerateInviteLinkSchema>;
