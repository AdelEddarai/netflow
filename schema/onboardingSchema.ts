import { z } from 'zod';

export const onboardingSchema = z.object({
	name: z.string().optional().nullable(),
	surname: z.string().optional().nullable(),
	useCase: z
		.string()
		.refine((string) => string === 'WORK' || string === 'STUDY' || string === 'PERSONAL_USE'),
	workspaceName: z
		.string()
		.min(4)
		.refine((username) => /^[a-zA-Z0-9]+$/.test(username)),
	workspaceImage: z.string().optional().nullable(),
});
