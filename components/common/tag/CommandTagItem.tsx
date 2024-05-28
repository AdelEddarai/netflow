import React, { useMemo, useState } from 'react';
import { CommandItem } from '@/components/ui/command';
import { Check, Pencil, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomColors, Tag as TagType } from '@prisma/client';

interface Props {
	tag: TagType;
	currentActiveTags: TagType[];
	onSelectActiveTag: (id: string) => void;
	onEditTagInfo: (tag: TagType) => void;
}

export const CommandTagItem = ({
	tag: { color, id, name, workspaceId },
	currentActiveTags,
	onSelectActiveTag,
	onEditTagInfo,
}: Props) => {
	const isActive = useMemo(() => {
		return (
			currentActiveTags.length > 0 && currentActiveTags.find((activeTag) => activeTag.id === id)
		);
	}, [currentActiveTags, id]);
	const [isHoverd, setIsHoverd] = useState(false);

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
		<CommandItem
			onMouseEnter={() => {
				setIsHoverd(true);
			}}
			onMouseLeave={() => {
				setIsHoverd(false);
			}}
			className='p-0 relative'>
			<Button
				onClick={() => {
					onSelectActiveTag(id);
				}}
				size={'sm'}
				variant={'ghost'}
				className={`w-full h-fit justify-between px-2 py-1.5 text-xs ${tagColor} `}>
				<p className='flex'>
					<Tag className='mr-2' size={16} />
					<span className='text-secondary-foreground'>{name}</span>
				</p>

				{isActive && <Check size={16} />}
			</Button>
			{isHoverd && (
				<Button
					onClick={() => {
						onEditTagInfo({
							id,
							color,
							name,
							workspaceId,
						});
					}}
					className='absolute top-1/2 right-6 translate-y-[-50%] h-fit  rounded-none z-20   bg-transparent hover:bg-transparent text-muted-foreground'
					size={'icon'}
					variant={'ghost'}>
					<Pencil size={16} />
				</Button>
			)}
		</CommandItem>
	);
};
