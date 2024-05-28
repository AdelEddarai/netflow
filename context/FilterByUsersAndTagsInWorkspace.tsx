'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Tag } from '@prisma/client';
import { createContext } from 'react';
import { useUserActivityStatus } from './UserActivityStatus';
import { FilterUser, UserActiveItemList } from '@/types/extended';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'next/navigation';
import { useRouter } from 'next-intl/client';

interface Props {
	children: React.ReactNode;
}
interface FilterByUsersAndTagsInWorkspaceContex {
	isLoding: boolean;
	isError: boolean;
	allTags: Tag[] | undefined;
	allUsers: UserActiveItemList[];
	filterAssignedUsers: FilterUser[];
	filterTags: Tag[];
	onChangeAssigedUser: (userId: string) => void;
	onChangeFilterTags: (tagId: string) => void;
	onClearUser: (userId: string) => void;
	onClearTag: (tagId: string) => void;
	onClearAll: () => void;
}

export const FilterByUsersAndTagsInWorkspaceCtx =
	createContext<FilterByUsersAndTagsInWorkspaceContex | null>(null);

export const FilterByUsersAndTagsInWorkspaceProvider = ({ children }: Props) => {
	const router = useRouter();
	const params = useParams();
	const searchParams = useSearchParams();

	const workspaceId = params.workspace_id ? params.workspace_id : null;
	const tagIdParam = searchParams.get('tagId');

	const [currentFilterdAsssigedToUsers, setCurrentFilterdAsssigedToUsers] = useState<FilterUser[]>(
		[]
	);
	const [currentFilterdTags, setCurrentFilterdTags] = useState<Tag[]>([]);

	const [isLoding, setIsLoding] = useState(true);
	const [isError, setIsError] = useState(true);

	const { allUsers, isLoading: isUsersLoding, isError: isUsersError } = useUserActivityStatus();

	const {
		data: tags,
		isLoading: isTagsLoding,
		isError: isTagsError,
	} = useQuery({
		queryFn: async () => {
			const res = await fetch(`/api/tags/get/get_workspace_tags?workspaceId=${workspaceId}`);

			if (!res.ok) throw new Error();

			const data = await res.json();
			return data as Tag[];
		},
		enabled: !!workspaceId,
		queryKey: ['getWorkspaceFilterTags'],
	});

	useEffect(() => {
		if (isTagsError || isUsersError) setIsError(true);
		else setIsError(false);
	}, [isUsersError, isTagsError]);

	useEffect(() => {
		if (isUsersLoding || isTagsLoding) setIsLoding(true);
		else setIsLoding(false);
	}, [isUsersLoding, isTagsLoding]);

	useEffect(() => {
		if (!tagIdParam || !tags) return;

		const isAlreadyFiltered = currentFilterdTags.some((tag) => tag.id === tagIdParam);
		if (isAlreadyFiltered) return;

		const tagToAdd = tags.find((tag) => tag.id === tagIdParam);
		if (tagToAdd) {
			setCurrentFilterdTags((prevTags) => {
				return [...prevTags, tagToAdd];
			});
		}
		router.replace(`/dashboard/workspace/${workspaceId}`);
	}, [tagIdParam, tags, currentFilterdTags, workspaceId, router]);

	const onChangeAssigedUserToFilterHandler = (userId: string) => {
		const isAlreadyFiltered = currentFilterdAsssigedToUsers.some(
			(currentUser) => currentUser.id === userId
		);

		if (isAlreadyFiltered) {
			setCurrentFilterdAsssigedToUsers((prevUsers) => {
				return prevUsers.filter((user) => user.id !== userId);
			});
		} else {
			const userToAdd = allUsers.find((user) => user.id === userId);
			if (userToAdd) {
				setCurrentFilterdAsssigedToUsers((prevUsers) => {
					return [
						...prevUsers,
						{
							id: userToAdd.id,
							image: userToAdd.image,
							username: userToAdd.username,
						},
					];
				});
			}
		}
	};

	const onChangeFilterTagsHandler = (tagId: string) => {
		if (!tags) return;

		const isAlreadyFiltered = currentFilterdTags.some((tag) => tag.id === tagId);

		if (isAlreadyFiltered) {
			setCurrentFilterdTags((prevTags) => {
				return prevTags.filter((tag) => tag.id !== tagId);
			});
		} else {
			const tagToAdd = tags.find((tag) => tag.id === tagId);
			if (tagToAdd) {
				setCurrentFilterdTags((prevTags) => {
					return [...prevTags, tagToAdd];
				});
			}
		}
	};
	const onClearUserHandler = (userId: string) => {
		setCurrentFilterdAsssigedToUsers((prevUsers) => {
			return prevUsers.filter((user) => user.id !== userId);
		});
	};

	const onClearTagHandler = (tagId: string) => {
		setCurrentFilterdTags((prevTags) => {
			return prevTags.filter((tag) => tag.id !== tagId);
		});
	};

	const onClearAllHandler = () => {
		setCurrentFilterdAsssigedToUsers([]);
		setCurrentFilterdTags([]);
	};

	return (
		<FilterByUsersAndTagsInWorkspaceCtx.Provider
			value={{
				allUsers: allUsers,
				allTags: tags,
				isLoding,
				isError,
				filterTags: currentFilterdTags,
				filterAssignedUsers: currentFilterdAsssigedToUsers,
				onChangeAssigedUser: onChangeAssigedUserToFilterHandler,
				onChangeFilterTags: onChangeFilterTagsHandler,
				onClearAll: onClearAllHandler,
				onClearTag: onClearTagHandler,
				onClearUser: onClearUserHandler,
			}}>
			{children}
		</FilterByUsersAndTagsInWorkspaceCtx.Provider>
	);
};

export const useFilterByUsersAndTagsInWorkspace = () => {
	const ctx = useContext(FilterByUsersAndTagsInWorkspaceCtx);
	if (!ctx) throw new Error('invalid use');

	return ctx;
};
