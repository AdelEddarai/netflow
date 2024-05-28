import { z } from 'zod';

export const mindMapSchema = z.object({
	mindMapId: z.string(),
	workspaceId: z.string(),
	content: z.any(),
});

export const updateMindMaPActiveTagsSchema = z.object({
	workspaceId: z.string(),
	mindMapId: z.string(),
	tagsIds: z.array(z.string()),
});

export const titleAndEmojiSchema = z.object({
	icon: z.string(),
	title: z.string().optional(),
});

export const updateTitleAndEmojiSchema = z.object({
	workspaceId: z.string(),
	mapId: z.string(),
	icon: z.string(),
	title: z.string().optional(),
});


export const deleteMindMapSchema = z.object({
	mindMapId: z.string(),
	workspaceId: z.string(),
});



export type MindMapSchema = z.infer<typeof mindMapSchema>;
export type UpdateMindMaPActiveTagsSchema = z.infer<typeof updateMindMaPActiveTagsSchema>;
export type TitleAndEmojiSchema = z.infer<typeof titleAndEmojiSchema>;
export type UpdateTitleAndEmojiSchema = z.infer<typeof updateTitleAndEmojiSchema>;
export type DeleteMindMapSchema = z.infer<typeof deleteMindMapSchema>;
