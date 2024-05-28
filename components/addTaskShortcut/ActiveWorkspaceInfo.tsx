'use client';
import { CustomColors, Workspace } from '@prisma/client';
import React, { useMemo } from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface Props {
	workspace: Workspace;
}

export const ActiveWorkspaceInfo = ({ workspace: { color, image, name } }: Props) => {
	const workspaceColor = useMemo(() => {
		switch (color) {
			case CustomColors.PURPLE:
				return 'bg-purple-600 ';

			case CustomColors.GREEN:
				return 'bg-green-600 ';

			case CustomColors.RED:
				return 'bg-red-600 ';

			case CustomColors.BLUE:
				return 'bg-blue-600 ';

			case CustomColors.CYAN:
				return 'bg-cyan-600 ';

			case CustomColors.EMERALD:
				return 'bg-emerald-600 ';

			case CustomColors.INDIGO:
				return 'bg-indigo-600 ';

			case CustomColors.LIME:
				return 'bg-lime-600 ';

			case CustomColors.ORANGE:
				return 'bg-orange-600 ';
			case CustomColors.FUCHSIA:
				return 'bg-fuchsia-600 ';

			case CustomColors.PINK:
				return 'bg-pink-600 ';

			case CustomColors.YELLOW:
				return 'bg-yellow-600 ';

			default:
				return 'bg-green-600 ';
		}
	}, [color]);

	return (
		<div className='flex items-center justify-between gap-2 '>
			<div>
				<div
					className={`w-10 h-10 rounded-md shadow-sm text-white font-bold flex justify-center items-center ${workspaceColor}`}>
					{image ? (
						<Image
							priority
							className='w-full h-full object-cover rounded-md '
							src={image}
							alt='worksace image'
							height={300}
							width={300}
						/>
					) : (
						<p>{name[0].toUpperCase()}</p>
					)}
				</div>
			</div>
			<div className='flex-grow break-words flex items-center justify-center gap-2 '>
				<p className='font-semibold '>{name ? name : 'Unitlied worksapce'}</p>
				<ChevronRight className='text-muted-foreground' size={18} />
			</div>
		</div>
	);
};
