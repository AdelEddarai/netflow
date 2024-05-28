import { z } from 'zod';

export const accountInfoSettingsSchema = z.object({
	username: z
		.string()
		.min(2, 'SCHEMA.USERNAME.SHORT')
		.refine((username) => /^[a-zA-Z0-9]+$/.test(username), {
			message: 'SCHEMA.USERNAME.SPECIAL_CHARS',
		}),
	language: z.string({
		required_error: 'SCHEMA.LANGUAGE',
	}),
	name: z.string().optional(),
	surname: z.string().optional(),
});

export type AccountInfoSettingsSchema = z.infer<typeof accountInfoSettingsSchema>;
