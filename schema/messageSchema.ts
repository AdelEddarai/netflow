import { AditionalRecourceTypes } from '@prisma/client';
import { z } from 'zod';

export const newMessageSchema = z.object({
	id: z.string(),
	edited: z.boolean(),
	content: z.string(),
	updatedAt: z.date().nullable(),
	aditionalRecources: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			url: z.string(),
			type: z.union([
				z.literal(AditionalRecourceTypes.PDF),
				z.literal(AditionalRecourceTypes.IMAGE),
			]),
		})
	),
	conversationId: z.string(),
	createdAt: z.string(),
	sender: z.object({
		id: z.string(),
		image: z.string().nullable().optional(),
		username: z.string(),
	}),
	senderId: z.string(),
});

export const editMessageSchema = z.object({
	id: z.string(),
	content: z.string(),
});

export const deleteMessageSchema = z.object({
	id: z.string(),
});

export type NewMessageSchema = z.infer<typeof newMessageSchema>;
export type DeleteMessageSchema = z.infer<typeof deleteMessageSchema>;
export type EditMessageSchema = z.infer<typeof editMessageSchema>;
