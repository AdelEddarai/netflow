import { z } from 'zod';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from './imageSchema';

export const linkSchema = z.object({
	link: z.string().url('SCHEMA.LINK'),
});

export const imageLinkSchema = z.object({
	file: z
		.any()
		.refine((file) => file, 'SCHEMA.IMAGE_REQUIRED')
		.refine((file) => file?.size <= MAX_FILE_SIZE, `SCHEMA.IMAGE.MAX`)
		.refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), 'SCHEMA.IMAGE.SUPPORTED'),
});

export type LinkSchema = z.infer<typeof linkSchema>;
export type ImageLinkSchema = z.infer<typeof imageLinkSchema>;
