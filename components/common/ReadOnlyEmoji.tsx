import { changeCodeToEmoji } from '@/lib/changeCodeToEmoji';
import { cn } from '@/lib/utils';
import React from 'react';

interface Props {
	selectedEmoji?: string;
	className?: string;
}

export const ReadOnlyEmoji = ({ selectedEmoji, className }: Props) => {
	return (
		<div
			className={cn(
				`w-16 h-16 rounded-lg bg-secondary flex justify-center items-center text-3xl px-3`,
				className
			)}>
			{changeCodeToEmoji(selectedEmoji ? selectedEmoji : '1f9e0')}
		</div>
	);
};
