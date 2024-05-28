import { z } from 'zod';

export const pomodoroSettingsSchema = z.object({
	workDuration: z.number().min(5).max(60),
	shortBreakDuration: z.number().min(1).max(15),
	longBreakDuration: z.number().min(10).max(45),
	longBreakInterval: z.number().min(2).max(10),
	rounds: z.number().min(1).max(10),
	soundEffect: z.string(),
	soundEffectVloume: z.number().min(0).max(100),
});

export type PomodoroSettingsSchema = z.infer<typeof pomodoroSettingsSchema>;
