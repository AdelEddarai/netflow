import { color } from '@/lib/constants';
import { z } from 'zod';

const id = z.string();
const tagName = z
	.string()
	.min(2, 'SCHEMA.TAG.SHORT')
	.max(20, 'SCHEMA.TAG.LONG')
	.refine((username) => /^[a-zA-Z0-9]+$/.test(username), {
		message: 'SCHEMA.TAG.SPECIAL_CHARS',
	});

export const tagSchema = z.object({
	id,
	tagName,
	color,
});

export const apitagSchema = z.object({
	id,
	workspaceId: id,
	tagName,
	color,
});

export const apiDeletetagSchema = z.object({
	id,
	workspaceId: id,
});

export type TagSchema = z.infer<typeof tagSchema>;
export type ApitagSchema = z.infer<typeof apitagSchema>;
export type ApiDeletetagSchema = z.infer<typeof apiDeletetagSchema>;
