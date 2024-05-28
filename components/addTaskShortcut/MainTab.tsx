'use client';
import React from 'react';
import { EmojiSelector } from '@/components/common/EmojiSelector';
import TextareaAutosize from 'react-textarea-autosize';
import { Workspace } from '@prisma/client';
import { ActiveWorkspaceInfo } from './ActiveWorkspaceInfo';
import { CalendarTask } from './CalendarTask';
import { DateRange } from 'react-day-picker';
import { useTranslations } from 'next-intl';
import Warning from '../ui/warning';

interface Props {
	renderedEmoji: string | string[];
	activeWorkspace: Workspace | null;
	date: DateRange | undefined;
	title: string;
	onSelectEmojiHandler: (emoji: string) => void;
	onChangeTabHandler: (tab: 'main' | 'workspaces') => void;
	onSelectedDate: (date: DateRange | undefined) => void;
	onChangeTitle: (title: string) => void;
}

export const MainTab = ({
	title,
	date,
	renderedEmoji,
	activeWorkspace,
	onSelectEmojiHandler,
	onChangeTabHandler,
	onSelectedDate,
	onChangeTitle,
}: Props) => {
	const t = useTranslations('TASK_SHORTCUT.MAIN_TAB');

	if (!activeWorkspace)
		return (
			<Warning blue className='my-0'>
				<p>{t('WARNING')}</p>
			</Warning>
		);
	else
		return (
			<>
				<div className='w-full flex flex-col gap-4   bg-background/70 border border-border p-3 rounded-md shadow-sm'>
					<div className='flex gap-4 w-full items-center '>
						<EmojiSelector
							slide='right'
							align='center'
							className='w-fit'
							onSelectedEmoji={onSelectEmojiHandler}>
							<span className='w-16 h-16 rounded-lg bg-secondary flex justify-center items-center text-3xl'>
								{renderedEmoji}
							</span>
						</EmojiSelector>

						<TextareaAutosize
							value={title}
							onChange={(e) => {
								onChangeTitle(e.target.value);
							}}
							placeholder={t('PLACEHOLDER')}
							className='w-full resize-none appearance-none overflow-hidden bg-transparent  placeholder:text-muted-foreground text-2xl font-semibold focus:outline-none max-h-28 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground scrollbar-track-secondary  '
						/>
					</div>
					<CalendarTask date={date} onSelectedDate={onSelectedDate} />
				</div>

				<div
					onClick={() => {
						activeWorkspace && onChangeTabHandler('workspaces');
					}}
					className='w-full flex gap-4  items-center justify-between bg-background/70 border border-border p-3 rounded-md shadow-sm cursor-pointer hover:bg-accent transition-colors duration-200'>
					<div className='text-muted-foreground'>
						<p>{t('WORKSPACE')}</p>
					</div>
					<div>
						<ActiveWorkspaceInfo workspace={activeWorkspace} />
					</div>
				</div>
			</>
		);
};
