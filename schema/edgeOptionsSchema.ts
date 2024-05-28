import { z } from 'zod';

export const edgeOptionsSchema = z.object({
	edgeId: z.string(),
	label: z.string(),
	type: z.enum(['customBezier', 'customStraight', 'customStepSharp', 'customStepRounded']),
	animated: z.boolean(),
	color: z.enum([
		'DEFAULT',
		'PURPLE',
		'RED',
		'GREEN',
		'BLUE',
		'PINK',
		'YELLOW',
		'ORANGE',
		'CYAN',
		'FUCHSIA',
		'LIME',
		'EMERALD',
		'INDIGO',
	]),
});

export type EdgeOptionsSchema = z.infer<typeof edgeOptionsSchema>;
