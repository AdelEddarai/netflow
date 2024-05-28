import { z } from 'zod';

export const MAX_FILE_SIZE = 400000;
export const ACCEPTED_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
	'image/gif',
];

export const imageSchema = z.object({
	image: z
		.any()
		.refine((file) => file?.size <= MAX_FILE_SIZE, `SCHEMA.IMAGE.MAX`)
		.refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), 'SCHEMA.IMAGE.SUPPORTED'),
});
export type ImageSchema = z.infer<typeof imageSchema>;
