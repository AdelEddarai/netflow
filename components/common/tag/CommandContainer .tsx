'use client';
import React, { useState } from 'react';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command';
import { Plus } from 'lucide-react';
import { CommandTagItem } from './CommandTagItem';
import { CreateNewTagOrEditTag } from './CreateNewTagOrEditTag';
import { Button } from '@/components/ui/button';
import { CustomColors, Tag } from '@prisma/client';
import { useTranslations } from 'next-intl';

interface Props {
	tags: Tag[];
	currentActiveTags: Tag[];
	workspaceId: string;
	onSelectActiveTag: (id: string) => void;
	onUpdateActiveTags: (tagId: string, color: CustomColors, name: string) => void;
	onDeleteActiveTag: (tagId: string) => void;
}

export const CommandContainer = ({
	tags,
	currentActiveTags,
	workspaceId,
	onSelectActiveTag,
	onUpdateActiveTags,
	onDeleteActiveTag,
}: Props) => {
	const [tab, setTab] = useState<'list' | 'newTag' | 'editTag'>('list');
	const [editedTagInfo, setEditedTagInfo] = useState<null | Tag>(null);

	const t = useTranslations('COMMON.TAG');

	const onEditTagInfoHandler = (tag: Tag) => {
		setEditedTagInfo(tag);
		setTab('editTag');
	};

	const onSetTab = (tab: 'list' | 'newTag' | 'editTag') => {
		setTab(tab);
	};

	return (
		<Command className='w-[15rem]'>
			{tab === 'list' && (
				<>
					<CommandInput className='text-xs' placeholder={t('FILTER')} />
					<CommandList>
						<CommandEmpty>{t('NOT_FOUND')}</CommandEmpty>
						{tags.length > 0 && (
							<>
								<CommandGroup heading={t('TAGS_HEADING')}>
									{tags.map((tag) => (
										<CommandTagItem
											key={tag.id}
											tag={tag}
											currentActiveTags={currentActiveTags}
											onSelectActiveTag={onSelectActiveTag}
											onEditTagInfo={onEditTagInfoHandler}
										/>
									))}
								</CommandGroup>
								<CommandSeparator />
							</>
						)}
						<CommandGroup heading={t('NEW_HEADING')}>
							<CommandItem className='p-0'>
								<Button
									size={'sm'}
									variant={'ghost'}
									className='w-full h-fit justify-start px-2 py-1.5 text-xs  '
									onClick={() => {
										setTab('newTag');
									}}>
									<Plus className='mr-1' size={16} />
									{t('ADD_TAG')}
								</Button>
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</>
			)}
			{tab === 'newTag' && <CreateNewTagOrEditTag onSetTab={onSetTab} workspaceId={workspaceId} />}
			{tab === 'editTag' && (
				<CreateNewTagOrEditTag
					edit
					currentActiveTags={currentActiveTags}
					workspaceId={workspaceId}
					color={editedTagInfo?.color}
					id={editedTagInfo?.id}
					tagName={editedTagInfo?.name}
					onSetTab={onSetTab}
					onSelectActiveTag={onSelectActiveTag}
					onUpdateActiveTags={onUpdateActiveTags}
					onDeleteActiveTag={onDeleteActiveTag}
				/>
			)}
		</Command>
	);
};
