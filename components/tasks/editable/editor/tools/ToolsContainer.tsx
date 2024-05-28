'use client';
import React from 'react';
import { Editor } from '@tiptap/react';
import {
	Bold,
	Code,
	Eraser,
	Italic,
	List,
	ListOrdered,
	Redo2,
	Strikethrough,
	UnderlineIcon,
	Undo2,
} from 'lucide-react';

import { OptionBtn } from './btn/OptionBtn';
import { Separator } from '@/components/ui/separator';
import { AddLink } from './AddLink';
import { useTranslations } from 'next-intl';

interface Props {
	editor: Editor;
}

export const ToolsContainer = ({ editor }: Props) => {
	const t = useTranslations('TASK.EDITOR.HOVER');

	return (
		<div className=' rounded-md  shadow-sm border bg-popover p-1 text-popover-foreground flex items-center gap-1 max-w-[13rem] flex-wrap sm:max-w-2xl '>
			<OptionBtn
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				className={editor.isActive('bulletList') ? 'bg-accent text-secondary-foreground' : ''}
				hoverText={t('UL')}>
				<List />
			</OptionBtn>
			<OptionBtn
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				className={editor.isActive('orderedList') ? 'bg-accent text-secondary-foreground' : ''}
				hoverText={t('OL')}>
				<ListOrdered />
			</OptionBtn>

			<Separator className='h-6' orientation='vertical' />

			<OptionBtn
				onClick={() => editor.chain().focus().toggleBold().run()}
				className={editor.isActive('bold') ? 'bg-accent text-secondary-foreground' : ''}
				hoverText={t('BOLD')}>
				<Bold size={16} />
			</OptionBtn>
			<OptionBtn
				onClick={() => editor.chain().focus().toggleItalic().run()}
				className={editor.isActive('italic') ? 'bg-accent text-secondary-foreground' : ''}
				hoverText={t('ITALIC')}>
				<Italic size={16} />
			</OptionBtn>
			<OptionBtn
				onClick={() => editor.chain().focus().toggleStrike().run()}
				className={editor.isActive('strike') ? 'bg-accent text-secondary-foreground' : ''}
				hoverText={t('STRIKETHROUGH')}>
				<Strikethrough size={16} />
			</OptionBtn>
			<OptionBtn
				onClick={() => editor.chain().focus().toggleUnderline().run()}
				className={editor.isActive('underline') ? 'bg-accent text-secondary-foreground' : ''}
				hoverText={t('UNDERLINE')}>
				<UnderlineIcon size={16} />
			</OptionBtn>

			<OptionBtn
				onClick={() => editor.chain().focus().toggleCode().run()}
				className={editor.isActive('code') ? 'bg-accent text-secondary-foreground' : ''}
				hoverText={t('CODE')}>
				<Code size={16} />
			</OptionBtn>

			<Separator className='h-6' orientation='vertical' />
			<AddLink editor={editor} />
			<Separator className='h-6' orientation='vertical' />
			<OptionBtn
				onClick={() => editor.chain().focus().setColor('#8b5cf6').run()}
				className={
					editor.isActive('textStyle', { color: '#8b5cf6' })
						? 'bg-accent text-secondary-foreground'
						: ''
				}
				data-testid='setPurple'
				hoverText={t('COLOR')}>
				<span className='w-4 h-4 rounded-full bg-violet-500'></span>
			</OptionBtn>
			<OptionBtn
				onClick={() => editor.chain().focus().setColor('#f43f5e').run()}
				className={
					editor.isActive('textStyle', { color: '#f43f5e' })
						? 'bg-accent text-secondary-foreground'
						: ''
				}
				data-testid='setRed'
				hoverText={t('COLOR')}>
				<span className='w-4 h-4 rounded-full bg-rose-500'></span>
			</OptionBtn>
			<OptionBtn
				onClick={() => editor.chain().focus().setColor('#f59e0b').run()}
				className={
					editor.isActive('textStyle', { color: '#f59e0b' })
						? 'bg-accent text-secondary-foreground'
						: ''
				}
				data-testid='setOrange'
				hoverText={t('COLOR')}>
				<span className='w-4 h-4 rounded-full bg-amber-500'></span>
			</OptionBtn>
			<OptionBtn
				onClick={() => editor.chain().focus().setColor('#10b981').run()}
				className={
					editor.isActive('textStyle', { color: '#10b981' })
						? 'bg-accent text-secondary-foreground'
						: ''
				}
				data-testid='setGreen'
				hoverText={t('COLOR')}>
				<span className='w-4 h-4 rounded-full bg-emerald-500'></span>
			</OptionBtn>
			<OptionBtn
				onClick={() => editor.chain().focus().setColor('#38bdf8').run()}
				className={
					editor.isActive('textStyle', { color: '#38bdf8' })
						? 'bg-accent text-secondary-foreground'
						: ''
				}
				data-testid='setBlue'
				hoverText={t('COLOR')}>
				<span className='w-4 h-4 rounded-full bg-sky-400'></span>
			</OptionBtn>
			<OptionBtn
				onClick={() => editor.chain().focus().unsetColor().run()}
				data-testid='unsetColor'
				hoverText={t('COLOR_DEFAULT')}>
				<span className='w-4 h-4 rounded-full bg-secondary-foreground'></span>
			</OptionBtn>
			<Separator className='h-6' orientation='vertical' />
			<OptionBtn onClick={() => editor.commands.undo()} hoverText={t('UNDO')}>
				<Undo2 size={16} />
			</OptionBtn>
			<OptionBtn onClick={() => editor.commands.redo()} hoverText={t('REDO')}>
				<Redo2 size={16} />
			</OptionBtn>
			<Separator className='h-6' orientation='vertical' />
			<OptionBtn onClick={() => editor.commands.deleteSelection()} hoverText={t('DELETE')}>
				<Eraser size={16} />
			</OptionBtn>
		</div>
	);
};
