'use client';
import React, { useEffect, useMemo, useState } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

interface OnSelect {
	id: string;
	keywords: string[];
	name: string;
	native: string;
	shortcodes: string;
	unified: string;
}

interface Props {
	asChild?: boolean;
	className?: string;
	children: React.ReactNode;
	id?: string;
	onSelectedEmoji: (emoji: string) => void;
	onOpenChange?: (open: boolean) => void;
	slide?: 'top' | 'right' | 'bottom' | 'left';
	align?: 'start' | 'center' | 'end';
}

export const EmojiSelector = ({
	asChild,
	className,
	children,
	onSelectedEmoji,
	align,
	slide,
	id,
}: Props) => {
	const { theme, systemTheme } = useTheme();
	const locale = useLocale();
	const [open, setOpen] = useState(false);

	const emojiTheme = useMemo(() => {
		switch (theme) {
			case 'dark':
				return 'dark';
			case 'light':
				return 'light';
			case 'system':
				return systemTheme;
		}
	}, [theme, systemTheme]);

	return (
		<DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger
				id={id}
				asChild={asChild}
				className={cn(
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  ring-offset-background rounded-lg',
					className
				)}>
				{children}
			</DropdownMenuTrigger>
			<DropdownMenuContent asChild side={slide} align={align}>
				<div className='z-50 emoji-picker'>
					<Picker
						emojiSize={20}
						emojiButtonSize={32}
						theme={emojiTheme}
						locale={locale}
						data={data}
						onEmojiSelect={(e: OnSelect) => {
							onSelectedEmoji(e.unified);
							setOpen(false);
						}}
					/>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
