'use client';
import { Tag } from 'lucide-react';
import React, { useMemo } from 'react';
import { CustomColors, Tag as TagType } from '@prisma/client';

interface Props {
	tag: TagType;
}

export const TagItem = ({ tag: { color, name } }: Props) => {
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
		<div className='w-fit  flex gap-2 items-center px-2.5 py-0.5  h-fit   text-xs rounded-lg border border-input bg-background'>
			<Tag className={` w-3 h-3  ${tagColor}`} size={16} />
			<span>{name}</span>
		</div>
	);
};
