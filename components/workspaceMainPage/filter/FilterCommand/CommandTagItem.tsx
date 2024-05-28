'use client';
import { Button } from '@/components/ui/button';
import { CommandItem } from '@/components/ui/command';
import { useFilterByUsersAndTagsInWorkspace } from '@/context/FilterByUsersAndTagsInWorkspace';
import { CustomColors, Tag as TagType } from '@prisma/client';
import { Check, Tag } from 'lucide-react';
import React, { useMemo } from 'react';

interface Props {
	tag: TagType;
	active: boolean;
}

export const CommandTagItem = ({ tag: { color, id, name }, active }: Props) => {
	const { onChangeFilterTags } = useFilterByUsersAndTagsInWorkspace();

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
		<CommandItem>
			<Button
				onClick={() => {
					onChangeFilterTags(id);
				}}
				size={'sm'}
				variant={'ghost'}
				className={`w-full h-fit justify-between px-2 py-1.5 text-xs ${tagColor} `}>
				<p className='flex items-center'>
					<Tag className='mr-2' size={16} />
					<span className='text-secondary-foreground'>{name}</span>
				</p>

				{active && <Check className='text-primary' size={16} />}
			</Button>
		</CommandItem>
	);
};
