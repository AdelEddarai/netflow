'use client';
import React, { useCallback, useRef, useState } from 'react';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Form, useForm } from 'react-hook-form';
import { TitleAndEmojiSchema, titleAndEmojiSchema } from '@/schema/mindMapSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import TextareaAutosize from 'react-textarea-autosize';
import { ChangeEmoji } from './ChangeEmoji';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { useAutosaveIndicator } from '@/context/AutosaveIndicator';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useTranslations } from 'next-intl';

interface Props {
	workspaceId: string;
	mapId: string;
	emoji: string;
	title?: string;
}

export const EditInfo = ({ mapId, workspaceId, emoji, title }: Props) => {
	const _titleRef = useRef<HTMLTextAreaElement>(null);
	const [open, setOpen] = useState(false);

	const { onSetStatus } = useAutosaveIndicator();
	const { toast } = useToast();

	const t = useTranslations('MIND_MAP.EDIT_TILT_AND_EMOJI');

	const { mutate: updateMindMap } = useMutation({
		mutationFn: async ({ icon, title }: { icon: string; title?: string }) => {
			await axios.post('/api/mind_maps/update/title_and_emoji', {
				mapId,
				workspaceId,
				icon,
				title,
			});
		},

		onSuccess: () => {
			onSetStatus('saved');
		},

		onError: () => {
			onSetStatus('unsaved');
			toast({
				title: t('ERROR'),
				variant: 'destructive',
			});
		},
	});

	const form = useForm<TitleAndEmojiSchema>({
		resolver: zodResolver(titleAndEmojiSchema),
		defaultValues: {
			icon: emoji,
			title: title ? title : '',
		},
	});

	const onFormSelectHandler = (emoji: string) => {
		form.setValue('icon', emoji);
	};

	const { ref: titleRef, ...rest } = form.register('title');

	const onSaveEdit = useCallback(() => {
		onSetStatus('pending');
		const { title, icon } = form.getValues();
		setOpen(false);

		updateMindMap({ icon, title });
	}, [form, onSetStatus, updateMindMap]);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<HoverCard openDelay={250} closeDelay={250}>
				<SheetTrigger asChild>
					<HoverCardTrigger>
						<Button onClick={() => setOpen(true)} variant={'ghost'} size={'icon'}>
							<Pencil size={20} />
						</Button>
					</HoverCardTrigger>
				</SheetTrigger>
				<HoverCardContent sideOffset={8} align='start'>
					{t('HOVER')}
				</HoverCardContent>
				<SheetContent className=' md:w-[26rem] md:max-w-md  '>
					<SheetHeader>
						<SheetTitle>{t('TITLE')}</SheetTitle>
						<SheetDescription>{t('DESC')}</SheetDescription>
					</SheetHeader>

					<form id='mind-map-info' className='mt-8 w-full flex flex-col gap-8'>
						<div className='flex flex-col md:flex-row gap-6 md:gap-4 md:items-center'>
							<ChangeEmoji emoji={form.getValues('icon')} onFormSelect={onFormSelectHandler} />

							<TextareaAutosize
								maxLength={100}
								{...rest}
								ref={(e) => {
									titleRef(e);
									// @ts-ignore
									_titleRef.current = e;
								}}
								onKeyDown={(e) => {
									if (e.key === 'Enter') e.preventDefault();
								}}
								placeholder={t('PLACEHOLDER')}
								className='w-full resize-none appearance-none overflow-hidden bg-transparent  placeholder:text-muted-foreground text-2xl font-semibold focus:outline-none '
							/>
						</div>
						<div className='flex  flex-col-reverse md:flex-row gap-4 items-center w-full'>
							<Button
								onClick={() => {
									setOpen(false);
								}}
								type='button'
								variant={'secondary'}
								className='w-full md:w-1/2 '>
								{t('CANCEL')}
							</Button>
							<Button
								onClick={() => {
									onSaveEdit();
								}}
								type='button'
								className='w-full md:w-1/2 text-white'>
								{t('SAVE')}
							</Button>
						</div>
					</form>
				</SheetContent>
			</HoverCard>
		</Sheet>
	);
};
