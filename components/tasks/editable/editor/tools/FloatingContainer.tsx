'use client';
import React from 'react';
import { Editor, FloatingMenu } from '@tiptap/react';
import { OptionBtn } from './btn/OptionBtn';
import {
	Heading1,
	Heading2,
	Heading3,
	Heading4,
	Heading5,
	Heading6,
	List,
	ListOrdered,
	Redo2,
	Undo2,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { AddImage } from './addImage/AddImage';
import { useTranslations } from 'next-intl';

interface Props {
	editor: Editor;
}

export const FloatingContainer = ({ editor }: Props) => {
	const t = useTranslations('TASK.EDITOR.HOVER');

	return (
		<FloatingMenu
			className='rounded-md  shadow-sm border bg-popover p-1 text-popover-foreground flex items-center gap-1 max-w-[13rem] flex-wrap sm:max-w-lg  '
			editor={editor}
			tippyOptions={{ duration: 100, zIndex: 20, maxWidth: 1000 }}>
			<OptionBtn
				onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
				className={
					editor.isActive('heading', { level: 1 }) ? 'bg-accent text-secondary-foreground' : ''
				}
				hoverText={t('H1')}>
				<Heading1 />
			</OptionBtn>

			<OptionBtn
				onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
				className={
					editor.isActive('heading', { level: 2 }) ? 'bg-accent text-secondary-foreground' : ''
				}
				hoverText={t('H2')}>
				<Heading2 />
			</OptionBtn>
			<OptionBtn
				onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
				className={
					editor.isActive('heading', { level: 3 }) ? 'bg-accent text-secondary-foreground' : ''
				}
				hoverText={t('H3')}>
				<Heading3 />
			</OptionBtn>
			<OptionBtn
				onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
				className={
					editor.isActive('heading', { level: 4 }) ? 'bg-accent text-secondary-foreground' : ''
				}
				hoverText={t('H4')}>
				<Heading4 />
			</OptionBtn>
			<OptionBtn
				onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
				className={
					editor.isActive('heading', { level: 5 }) ? 'bg-accent text-secondary-foreground' : ''
				}
				hoverText={t('H5')}>
				<Heading5 />
			</OptionBtn>
			<OptionBtn
				onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
				className={
					editor.isActive('heading', { level: 6 }) ? 'bg-accent text-secondary-foreground' : ''
				}
				hoverText={t('H6')}>
				<Heading6 />
			</OptionBtn>
			<Separator className='h-6' orientation='vertical' />
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
			<AddImage editor={editor} />
			<Separator className='h-6' orientation='vertical' />
			<OptionBtn onClick={() => editor.commands.undo()} hoverText={t('UNDO')}>
				<Undo2 size={16} />
			</OptionBtn>
			<OptionBtn onClick={() => editor.commands.redo()} hoverText={t('REDO')}>
				<Redo2 size={16} />
			</OptionBtn>
		</FloatingMenu>
	);
};
