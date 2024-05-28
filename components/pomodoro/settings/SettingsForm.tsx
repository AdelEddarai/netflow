'use client';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { LoadingState } from '@/components/ui/loading-state';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { PomodoroSettingsSchema, pomodoroSettingsSchema } from '@/schema/pomodoroSettingsSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { PomodoroSettings, PomodoroSoundEffect } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Clock, Play, Volume2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import React, { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Howl } from 'howler';
import { pathsToSoundEffects } from '@/lib/constants';

interface Props {
	pomodoroSettings: PomodoroSettings;
}

export const SettingsForm = ({
	pomodoroSettings: {
		longBreakDuration,
		longBreakInterval,
		rounds,
		shortBreakDuration,
		workDuration,
		soundEffect,
		soundEffectVloume,
	},
}: Props) => {
	const t = useTranslations('POMODORO.SETTINGS.FORM');
	const m = useTranslations('MESSAGES');
	const [isPlaying, setIsPlaying] = useState(false);

	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<PomodoroSettingsSchema>({
		resolver: zodResolver(pomodoroSettingsSchema),
		defaultValues: {
			workDuration,
			shortBreakDuration,
			longBreakDuration,
			longBreakInterval,
			rounds,
			soundEffect,
			soundEffectVloume: soundEffectVloume * 100,
		},
	});

	const { mutate: updateSettings, isLoading: isUpdating } = useMutation({
		mutationFn: async (formData: PomodoroSettingsSchema) => {
			await axios.post('/api/pomodoro/update', formData);
		},
		onError: (err: AxiosError) => {
			const error = err?.response?.data ? err.response.data : 'ERRORS.DEFAULT';

			toast({
				title: m(error),
				variant: 'destructive',
			});
		},
		onSuccess: async () => {
			toast({
				title: m('SUCCES.UPDATE_POMODORO_SETTINGS'),
			});
			router.refresh();
		},
		mutationKey: ['updatePomodoroSettings'],
	});

	const { mutate: resetSettings, isLoading: isReseting } = useMutation({
		mutationFn: async () => {
			await axios.post('/api/pomodoro/update', {
				workDuration: 25,
				shortBreakDuration: 5,
				longBreakDuration: 15,
				longBreakInterval: 2,
				rounds: 3,
				soundEffect: PomodoroSoundEffect.BELL,
				soundEffectVloume: 50,
			});
		},
		onError: (err: AxiosError) => {
			const error = err?.response?.data ? err.response.data : 'ERRORS.DEFAULT';

			toast({
				title: m(error),
				variant: 'destructive',
			});
		},
		onSuccess: async () => {
			toast({
				title: m('SUCCES.RESET_POMODORO_SETTINGS'),
			});
			form.reset({
				workDuration: 25,
				shortBreakDuration: 5,
				longBreakDuration: 15,
				longBreakInterval: 2,
				rounds: 3,
				soundEffect: PomodoroSoundEffect.BELL,
				soundEffectVloume: 50,
			});
			router.refresh();
		},
		mutationKey: ['resetPomodoroSettings'],
	});

	const isDeafultValue = useMemo(() => {
		return (
			workDuration === 25 &&
			shortBreakDuration === 5 &&
			longBreakDuration === 15 &&
			longBreakInterval === 2 &&
			rounds === 3 &&
			soundEffect === PomodoroSoundEffect.BELL &&
			soundEffectVloume === 0.5
		);
	}, [
		workDuration,
		shortBreakDuration,
		longBreakDuration,
		longBreakInterval,
		rounds,
		soundEffect,
		soundEffectVloume,
	]);

	const onSubmit = (data: PomodoroSettingsSchema) => {
		updateSettings(data);
	};

	const playSoundEffectHanlder = useCallback(
		(soundEffect: PomodoroSoundEffect) => {
			const currentPath = pathsToSoundEffects[soundEffect];

			const sound = new Howl({
				src: currentPath,
				html5: true,
				onend: () => {
					setIsPlaying(false);
				},
				volume: form.getValues('soundEffectVloume') / 100,
			});

			sound.play();
			setIsPlaying(true);
		},
		[form]
	);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				<div className='space-y-6  w-full'>
					<div className='flex gap-2 items-center text-muted-foreground'>
						<Clock />
						<p>{t('TIMER')}</p>
					</div>
					<FormField
						control={form.control}
						name='workDuration'
						render={({ field: { value, onChange } }) => (
							<FormItem className='space-y-1.5'>
								<FormLabel>{t('WORK.LABEL', { value })}</FormLabel>
								<FormControl>
									<Slider
										min={15}
										max={60}
										step={1}
										defaultValue={[value]}
										onValueChange={(vals) => {
											onChange(vals[0]);
										}}
										value={[value]}
									/>
								</FormControl>
								<FormDescription>{t('WORK.DESC')}</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='shortBreakDuration'
						render={({ field: { value, onChange } }) => (
							<FormItem className='space-y-1.5'>
								<FormLabel>{t('SHORT_BREAK.LABEL', { value })}</FormLabel>
								<FormControl>
									<Slider
										min={1}
										max={15}
										step={1}
										defaultValue={[value]}
										onValueChange={(vals) => {
											onChange(vals[0]);
										}}
										value={[value]}
									/>
								</FormControl>
								<FormDescription>{t('SHORT_BREAK.DESC')}</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='longBreakDuration'
						render={({ field: { value, onChange } }) => (
							<FormItem className='space-y-1.5'>
								<FormLabel>{t('LONG_BREAK.LABEL', { value })}</FormLabel>
								<FormControl>
									<Slider
										min={10}
										max={45}
										step={1}
										defaultValue={[value]}
										onValueChange={(vals) => {
											onChange(vals[0]);
										}}
										value={[value]}
									/>
								</FormControl>
								<FormDescription>{t('LONG_BREAK.DESC')}</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='rounds'
						render={({ field: { value, onChange } }) => (
							<FormItem className='space-y-1.5'>
								<FormLabel>{t('ROUNDS.LABEL', { value })}</FormLabel>
								<FormControl>
									<Slider
										min={1}
										max={10}
										step={1}
										defaultValue={[value]}
										onValueChange={(vals) => {
											onChange(vals[0]);
										}}
										value={[value]}
									/>
								</FormControl>
								<FormDescription>{t('ROUNDS.DESC')}</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='longBreakInterval'
						render={({ field: { value, onChange } }) => (
							<FormItem className='space-y-1.5'>
								<FormLabel>{t('LONG_BREAKS_INTERVAL.LABEL', { value })}</FormLabel>
								<FormControl>
									<Slider
										min={2}
										max={10}
										step={1}
										defaultValue={[value]}
										onValueChange={(vals) => {
											onChange(vals[0]);
										}}
										value={[value]}
									/>
								</FormControl>
								<FormDescription>{t('LONG_BREAKS_INTERVAL.DESC')}</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='flex gap-2 items-center text-muted-foreground'>
						<Volume2 />
						<p>{t('SOUND')}</p>
					</div>

					<FormField
						control={form.control}
						name='soundEffect'
						render={({ field }) => (
							<FormItem className='sm:max-w-sm space-y-1.5'>
								<FormLabel>{t('ALARM.LABEL')}</FormLabel>
								<div className='flex gap-2 items-center'>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value={PomodoroSoundEffect.ANALOG}>
												{t('ALARM.ANALOG')}
											</SelectItem>
											<SelectItem value={PomodoroSoundEffect.BELL}>{t('ALARM.BELL')}</SelectItem>
											<SelectItem value={PomodoroSoundEffect.BIRD}>{t('ALARM.BIRD')}</SelectItem>
											<SelectItem value={PomodoroSoundEffect.CHURCH_BELL}>
												{t('ALARM.CHURCH_BELL')}
											</SelectItem>
											<SelectItem value={PomodoroSoundEffect.DIGITAL}>
												{t('ALARM.DIGITAL')}
											</SelectItem>
											<SelectItem value={PomodoroSoundEffect.FANCY}>{t('ALARM.FANCY')}</SelectItem>
										</SelectContent>
									</Select>
									<Button
										disabled={isPlaying}
										onClick={() => {
											playSoundEffectHanlder(field.value as PomodoroSoundEffect);
										}}
										type='button'
										variant={'ghost'}
										size={'icon'}>
										<Play />
									</Button>
								</div>
								<FormDescription>{t('ALARM.DESC')}</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='soundEffectVloume'
						render={({ field: { value, onChange } }) => (
							<FormItem className='sm:max-w-sm space-y-1.5'>
								<FormLabel>{t('VOLUME.LABEL', { value })}</FormLabel>
								<FormControl>
									<Slider
										min={0}
										max={100}
										step={1}
										defaultValue={[value]}
										onValueChange={(vals) => {
											onChange(vals[0]);
										}}
										value={[value]}
									/>
								</FormControl>
								<FormDescription>{t('VOLUME.DESC')}</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className='flex flex-col-reverse sm:flex-row sm:justify-end items-center gap-4'>
					<Button
						disabled={isUpdating || isDeafultValue}
						type='button'
						onClick={() => {
							resetSettings();
						}}
						className='w-full sm:w-auto'
						variant={'secondary'}>
						{isReseting ? <LoadingState loadingText={t('RESET.BTN_PENDING')} /> : t('RESET.BTN')}
					</Button>
					<Button disabled={isReseting} className='text-white w-full sm:w-auto' type='submit'>
						{isUpdating ? <LoadingState loadingText={t('SAVE.BTN_PENDING')} /> : t('SAVE.BTN')}
					</Button>
				</div>
			</form>
		</Form>
	);
};
