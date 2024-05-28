import { z } from 'zod';
import { password } from './signInSchema';

export const signUpSchema = z.object({
	email: z.string().email('SCHEMA.EMAIL'),
	password: password,
	username: z
		.string()
		.min(2, 'SCHEMA.USERNAME.SHORT')
		.refine((username) => /^[a-zA-Z0-9]+$/.test(username), {
			message: 'SCHEMA.USERNAME.SPECIAL_CHARS',
		}),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
