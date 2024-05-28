import { z } from 'zod';

export const aditionalUserInfoFirstPart = z.object({
	name: z.string().optional(),
	surname: z.string().optional(),
});

export const aditionalUserInfoSecondPart = z.object({
	useCase: z.enum(['WORK', 'STUDY', 'PERSONAL_USE'], {
		required_error: 'SCHEMA.CHOOSE_ONE',
	}),
});

export type AditionalUserInfoFirstPart = z.infer<typeof aditionalUserInfoFirstPart>;
export type AditionalUserInfoSecondPart = z.infer<typeof aditionalUserInfoSecondPart>;
