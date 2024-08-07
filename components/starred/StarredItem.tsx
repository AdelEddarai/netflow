'use client';
import React from 'react';
import { StarredItem as StarredItemType } from '@/types/saved';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { ReadOnlyEmoji } from '../common/ReadOnlyEmoji';
import { MoreHorizontal, Star, StarOff } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { UserHoverInfoCard } from '@/components/common/UserHoverInfoCard';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUnstarItem } from '@/hooks/useUnstarItem';
import { useRouter } from 'next/navigation';
import { useTuncateText } from '@/hooks/useTruncateText';
import { StarSvg } from '../common/StarSvg';

interface Props {
	item: StarredItemType;
	sortType: 'asc' | 'desc';
	userId: string;
}

export const StarredItem = ({
	item: { emoji, id, link, title, type, updated, workspaceName, itemId, workspaceId },
	sortType,
	userId,
}: Props) => {
	const tuncateTitle = useTuncateText(title, 40, 15);
	const t = useTranslations('STARRED');
	const c = useTranslations('COMMON');

	const router = useRouter();

	const onUnstar = useUnstarItem({ id, itemId, sortType, type, userId });

	const format = useFormatter();
	const dateTime = new Date(updated.at);
	const now = new Date();

	const itemTypeSentence =
		type === 'mindMap' ? c('EDITED_ITEM_SENTENCE.MIND_MAP') : c('EDITED_ITEM_SENTENCE.TASK');

	const unstarHanlder = (e: React.MouseEvent) => {
		e.preventDefault();
		onUnstar();
	};

	return (
		<Link href={link}>
			<Card className='bg-background border-none hover:bg-accent transition-colors duration-200 p-2'>
				<CardContent className='flex w-full justify-between sm:items-center p-2 sm:p-2 pt-0 '>
					<div className='flex flex-row gap-2 sm:gap-4  w-full'>
						<ReadOnlyEmoji className='sm:h-16 sm:w-16 h-12 w-12' selectedEmoji={emoji} />
						<div className='w-full'>
							<div className='flex items-center'>
								<h2 className='text-lg sm:text-2xl font-semibold'>
									{!title && type === 'mindMap' && c('DEFAULT_NAME.MIND_MAP')}
									{!title && type === 'task' && c('DEFAULT_NAME.TASK')}
									{title && tuncateTitle}
								</h2>
								<StarSvg className='ml-2 w-4 h-4 sm:w-5 sm:h-5' />
							</div>
							{updated.by && (
								<div className='flex flex-col md:flex-row md:items-center md:gap-1'>
									<p className='text-muted-foreground'>
										<span>{itemTypeSentence}</span> {format.relativeTime(dateTime, now)}{' '}
										{c('EDITED_ITEM_SENTENCE.BY')}
									</p>
									<div className='flex items-center gap-1'>
										<UserHoverInfoCard className='px-0' user={updated.by} />
										<p>
											{c('EDITED_ITEM_SENTENCE.IN')}{' '}
											<Button
												variant={'link'}
												onClick={(e) => {
													e.preventDefault();
													router.push(`/dashboard/workspace/${workspaceId}`);
												}}
												className='px-0'>
												{workspaceName}
											</Button>
										</p>
									</div>
								</div>
							)}
						</div>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant={'ghost'} size={'icon'}>
								<MoreHorizontal />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuItem onClick={unstarHanlder} className='cursor-pointer'>
								<StarOff size={18} /> <span className='ml-2'>{t('UNSTAR')}</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</CardContent>
			</Card>
		</Link>
	);
};
