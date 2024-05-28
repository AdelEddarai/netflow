import { z } from 'zod';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from './imageSchema';
import { color } from '@/lib/constants';

const id = z.string();

const workspaceName = z
	.string()
	.min(4, 'SCHEMA.WORKSPACE.SHORT')
	.max(20, 'SCHEMA.WORKSPACE.LONG')
	.refine((username) => /^[a-zA-Z0-9 ]+$/.test(username), {
		message: 'SCHEMA.WORKSPACE.SPECIAL_CHARS',
	});

const file = z
	.any()
	.refine((file) => file?.size <= MAX_FILE_SIZE, `SCHEMA.IMAGE.MAX`)
	.refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), 'SCHEMA.IMAGE.SUPPORTED')
	.optional()
	.nullable();

export const workspaceSchema = z.object({
	workspaceName,
	file,
});

export const apiWorkspaceSchema = z.object({
	workspaceName,
	file: z.string().optional().nullable(),
});

export const workspacePicture = z.object({
	file,
});

export const apiWorkspacePicture = z.object({
	picture: z.string(),
	id,
});

export const workspaceEditData = z.object({
	workspaceName,
	color,
});

export const apiWorkspaceEditData = z.object({
	id,
	workspaceName,
	color,
});

export const apiWorkspaceDeletePicture = z.object({
	id,
});

export const apiWorkspaceDelete = z.object({
	id,
	workspaceName,
});

export type ApiWorkspaceSchema = z.infer<typeof apiWorkspaceSchema>;
export type WorkspaceSchema = z.infer<typeof workspaceSchema>;

export type ApiWorkspacePicture = z.infer<typeof apiWorkspacePicture>;
export type WorkspacePicture = z.infer<typeof workspacePicture>;

export type WorkspaceEditData = z.infer<typeof workspaceEditData>;
export type ApiWorkspaceEditData = z.infer<typeof apiWorkspaceEditData>;

export type ApiWorkspaceDeletePicture = z.infer<typeof apiWorkspaceDeletePicture>;
export type ApiWorkspaceDelete = z.infer<typeof apiWorkspaceDelete>;
