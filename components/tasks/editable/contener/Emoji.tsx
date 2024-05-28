'use client';
import React, { useState } from 'react';
import { EmojiSelector } from '@/components/common/EmojiSelector';
import { useDebouncedCallback } from 'use-debounce';
import { useMutation } from '@tanstack/react-query';
import { useAutosaveIndicator } from '@/context/AutosaveIndicator';
import axios from 'axios';
import { useChangeCodeToEmoji } from '@/hooks/useChangeCodeToEmoji';

interface Props {
	emoji: string;
	taskId: string;
	workspaceId: string;
	onFormSelect: (emoji: string) => void;
}

export const Emoji = ({ onFormSelect, taskId, workspaceId, emoji }: Props) => {
	const [selectedEmoji, setSelectedEmoji] = useState(emoji);
	const { onSetStatus, status } = useAutosaveIndicator();
	const renderedEmoji = useChangeCodeToEmoji(selectedEmoji);

	const { mutate: updateTaskEmoji } = useMutation({
		mutationFn: async () => {
			await axios.post('/api/task/update/emoji', {
				workspaceId,
				selectedEmoji,
				taskId,
			});
		},

		onSuccess: () => {
			onSetStatus('saved');
		},

		onError: () => {
			onSetStatus('unsaved');
		},
	});

	const debounced = useDebouncedCallback(() => {
		onSetStatus('pending');
		updateTaskEmoji();
	}, 2000);

	const selectEmojiHandler = (emoji: string) => {
		if (status !== 'unsaved') onSetStatus('unsaved');
		setSelectedEmoji(emoji);
		onFormSelect(emoji);
		debounced();
	};

	return (
		<EmojiSelector onSelectedEmoji={selectEmojiHandler}>
			<span className='w-16 h-16 rounded-lg bg-secondary flex justify-center items-center text-3xl'>
				{renderedEmoji}
			</span>
		</EmojiSelector>
	);
};
