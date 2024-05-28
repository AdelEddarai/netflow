'use client';
import { EmojiSelector } from '@/components/common/EmojiSelector';
import { useChangeCodeToEmoji } from '@/hooks/useChangeCodeToEmoji';
import React, { useState } from 'react';

interface Props {
	emoji: string;
	onFormSelect: (emoji: string) => void;
}

export const ChangeEmoji = ({ emoji,  onFormSelect}: Props) => {
	const [selectedEmoji, setSelectedEmoji] = useState(emoji);
	const renderedEmoji = useChangeCodeToEmoji(selectedEmoji);

	const selectEmojiHandler = (emoji: string) => {
		setSelectedEmoji(emoji);
		onFormSelect(emoji);
	};

	return (
		<EmojiSelector onSelectedEmoji={selectEmojiHandler}>
			<span className='w-16 h-16 rounded-lg bg-secondary flex justify-center items-center text-3xl'>
				{renderedEmoji}
			</span>
		</EmojiSelector>
	);
};
