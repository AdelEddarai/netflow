'use client';
import { Tag } from 'lucide-react';
import Link from 'next-intl/link';
import React, { useMemo } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CustomColors, Tag as TagType } from '@prisma/client';

interface Props {
	tag: TagType;
	disabled?: boolean;
}

export const LinkTag = ({ tag: { color, id, name, workspaceId }, disabled }: Props) => {
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
		<Link
			aria-disabled={disabled}
			href={`/dashboard/workspace/${workspaceId}?tagId=${id}`}
			className={cn(
				` ${buttonVariants({
					variant: 'outline',
					size: 'sm',
				})}  px-2.5 py-0.5  h-fit  text-xs ${disabled ? 'pointer-events-none' : ''}`
			)}>
			<Tag className={`mr-2 w-3 h-3  ${tagColor}`} size={16} />
			<span>{name}</span>
		</Link>
	);
};
