'use client';
import React from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Users2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingState } from '@/components/ui/loading-state';
import { CommandContainer } from './CommandContainer';
import { useRouter } from 'next-intl/client';
import { useQuery } from '@tanstack/react-query';
import { UsersAssingedToMindMapInfo } from '@/types/extended';
import { useTranslations } from 'next-intl';

interface Props {
	className?: string;
	plusIconSize?: number;
	dropDownSizeOffset?: number;
	workspaceId: string;
	mindMapId: string;
}

export const AssignedToMindMapSelector = ({
	className,
	dropDownSizeOffset,
	plusIconSize = 16,
	mindMapId,
	workspaceId,
}: Props) => {
	const router = useRouter();
	const t = useTranslations('MIND_MAP.ASSIGNMENT');

	const {
		data: assgingedUsersInfo,
		isLoading: isLodingInfo,
		isError,
	} = useQuery({
		queryFn: async () => {
			const res = await fetch(
				`/api/assigned_to/mind_maps/get?workspaceId=${workspaceId}&mindMapId=${mindMapId}`
			);

			if (!res.ok) throw new Error();

			const data = await res.json();
			return data as UsersAssingedToMindMapInfo;
		},

		queryKey: ['getAssignedToMindMapInfo', mindMapId],
	});

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					className={cn(
						`w-fit h-fit text-xs justify-start text-left font-normal px-2.5 py-0.5 `,
						className
					)}
					variant={'outline'}
					size={'sm'}>
					<Users2 size={plusIconSize} className='mr-1 ' />
					<span>{t('TRIGGER')}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent sideOffset={dropDownSizeOffset && dropDownSizeOffset}>
				{isLodingInfo && (
					<div className=' p-3  flex justify-center items-center'>
						<LoadingState />
					</div>
				)}
				{!isLodingInfo && assgingedUsersInfo && (
					<CommandContainer
						users={assgingedUsersInfo.subscribers}
						mindMapId={mindMapId}
						workspaceId={workspaceId}
					/>
				)}
				{isError && (
					<div className='p-3 text-sm flex justify-center items-center flex-col gap-4 '>
						<p>{t('ERROR_MSG')}</p>
						<Button
							className='w-full'
							size={'sm'}
							variant={'default'}
							onClick={() => router.refresh()}>
							{t('ERROR_BTN')}
						</Button>
					</div>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
