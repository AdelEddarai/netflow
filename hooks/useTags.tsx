'use client';

import { useAutosaveIndicator } from '@/context/AutosaveIndicator';
import { CustomColors, Tag } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { DebouncedState } from 'use-debounce';

export const useTags = (
	workspaceId: string,
	isMounted: boolean,
	initialActiveTags: Tag[],
	onDebaunced?: DebouncedState<() => void>
) => {
	const [currentActiveTags, setCurrentActiveTags] = useState(initialActiveTags);
	const { onSetStatus, status } = useAutosaveIndicator();

	const {
		data: tags,
		isLoading: isLodingTags,
		isError,
	} = useQuery({
		queryFn: async () => {
			const res = await fetch(`/api/tags/get/get_workspace_tags?workspaceId=${workspaceId}`);

			if (!res.ok) throw new Error();

			const data = await res.json();
			return data as Tag[];
		},
		enabled: isMounted,
		queryKey: ['getWorkspaceTags'],
	});

	const onSelectActiveTagHandler = useCallback(
		(tagId: string) => {
			if (status !== 'unsaved') onSetStatus('unsaved');
			setCurrentActiveTags((prevActiveTags) => {
				const tagIndex = prevActiveTags.findIndex((activeTag) => activeTag.id === tagId);

				if (tagIndex !== -1) {
					const updatedActiveTags = [...prevActiveTags];
					updatedActiveTags.splice(tagIndex, 1);
					return updatedActiveTags;
				} else {
					const selectedTag = tags!.find((tag) => tag.id === tagId);
					if (selectedTag) {
						return [...prevActiveTags, selectedTag];
					}
				}

				return prevActiveTags;
			});

			onDebaunced && onDebaunced();
		},
		[onSetStatus, status, tags, onDebaunced]
	);

	const onUpdateActiveTagsHandler = useCallback(
		(tagId: string, color: CustomColors, name: string) => {
			setCurrentActiveTags((prevActiveTags) => {
				if (prevActiveTags.length === 0) return prevActiveTags;
				const updatedTags = prevActiveTags.map((tag) =>
					tag.id === tagId ? { ...tag, name, color } : tag
				);

				return updatedTags;
			});
		},
		[]
	);

	const onDeleteActiveTagHandler = useCallback(
		(tagId: string) => {
			if (status !== 'unsaved') onSetStatus('unsaved');
			setCurrentActiveTags((prevActiveTags) => {
				if (prevActiveTags.length === 0) return prevActiveTags;
				const updatedTags = prevActiveTags.filter((tag) => tag.id !== tagId);

				return updatedTags;
			});
			onDebaunced && onDebaunced();
		},
		[onSetStatus, status, onDebaunced]
	);

	return {
		currentActiveTags,
		tags,
		isLodingTags,
		isError,
		onSelectActiveTagHandler,
		onUpdateActiveTagsHandler,
		onDeleteActiveTagHandler,
	};
};
