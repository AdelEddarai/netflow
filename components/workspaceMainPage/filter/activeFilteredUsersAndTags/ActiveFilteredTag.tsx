'use client';
import { Button } from '@/components/ui/button';
import { Tag } from 'lucide-react';
import React, { useMemo } from 'react';
import { CustomColors, Tag as TagType } from '@prisma/client';
import { useFilterByUsersAndTagsInWorkspace } from '@/context/FilterByUsersAndTagsInWorkspace';

interface Props {
	tag: TagType;
}

export const ActiveFilteredTag = ({ tag: { color, id, name } }: Props) => {
	const { onClearTag } = useFilterByUsersAndTagsInWorkspace();

	const tagColor = useMemo(() => {
		switch (color) {
			case CustomColors.PURPLE:
				return 'text-purple-600 hover:text-purple-500';

			case CustomColors.GREEN:
				return 'text-green-600 hover:text-green-500';

			case CustomColors.RED:
				return 'text-red-600 hover:text-red-500';

			case CustomColors.BLUE:
				return 'text-blue-600 hover:text-blue-500';

			case CustomColors.CYAN:
				return 'text-cyan-600 hover:text-cyan-500';

			case CustomColors.EMERALD:
				return 'text-emerald-600 hover:text-emerald-500';

			case CustomColors.INDIGO:
				return 'text-indigo-600 hover:text-indigo-500';

			case CustomColors.LIME:
				return 'text-lime-600 hover:text-lime-500';

			case CustomColors.ORANGE:
				return 'text-orange-600 hover:text-orange-500';

			case CustomColors.FUCHSIA:
				return 'text-fuchsia-600 hover:text-fuchsia-500';

			case CustomColors.PINK:
				return 'text-pink-600 hover:text-pink-500';

			case CustomColors.YELLOW:
				return 'text-yellow-600 hover:text-yellow-500';

			default:
				return 'text-green-600 hover:text-green-500';
		}
	}, [color]);
	return (
		<Button
			onClick={() => {
				onClearTag(id);
			}}
			size={'sm'}
			variant={'outline'}
			className={`w-fit  flex gap-2 h-9 items-center px-2 py-1.5 text-xs rounded-lg ${tagColor} `}>
			<p className='flex items-center'>
				<Tag className='mr-2' size={16} />
				<span className='text-secondary-foreground'>{name}</span>
			</p>
		</Button>
	);
};
