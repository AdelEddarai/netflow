'use client';
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import { useTranslations } from 'next-intl';

interface Props {
	content?: JSON;
}

export const ReadOnlyEditor = ({ content }: Props) => {
	const t = useTranslations('TASK.EDITOR.READ_ONLY');

	const editor = useEditor({
		editorProps: {
			handleDrop: () => {
				return false;
			},
			attributes: {
				class:
					'focus:outline-none prose prose-headings:text-secondary-foreground prose-p:text-secondary-foreground prose-strong:text-secondary-foreground prose-a:text-primary prose-a:no-underline prose-a:cursor-pointer   w-full focus-visible:outline-none rounded-md max-w-none prose-code:text-secondary-foreground prose-code:bg-muted  prose-ol:text-secondary-foreground prose-ul:text-secondary-foreground prose-li:marker:text-secondary-foreground prose-li:marker:font-bold prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl  prose-h5:text-xl prose-h6:text-lg prose-p:text-base prose-headings:line-clamp-1 prose-headings:mt-0 prose-p:my-2',
			},
		},

		extensions: [
			StarterKit.configure({
				dropcursor: {
					class: 'text-primary',
				},
			}),
			Underline,
			Link,
			Color,
			TextStyle,
			Image,
		],
		content: content ? content : `<p>${t('NO_CONTENT')}</p>`,
		editable: false,
	});

	return <EditorContent className='' spellCheck={false} editor={editor} />;
};
