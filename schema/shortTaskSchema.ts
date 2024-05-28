import { z } from 'zod';

export const shortTaskSchema = z.object({
	icon: z.string(),
	title: z.string(),
	date: z
		.object({
			from: z.string().nullable().optional(),
			to: z.string().nullable().optional(),
		})
		.nullable()
		.optional(),
	workspaceId: z.string(),
});

export type ShortTaskSchema = z.infer<typeof shortTaskSchema>;
