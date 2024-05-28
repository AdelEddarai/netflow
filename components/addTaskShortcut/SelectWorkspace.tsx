'use client';
import { CustomColors, Workspace } from '@prisma/client';
import React, { useMemo } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import Link from 'next-intl/link';
import { buttonVariants } from '@/components/ui/button';

interface Props {
	workspace: Workspace;
	onSelectActiveWorkspace: (workspace: Workspace) => void;
}

export const SelectWorkspace = ({ workspace, onSelectActiveWorkspace }: Props) => {
	const workspaceColor = useMemo(() => {
		switch (workspace.color) {
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
	}, [workspace.color]);

	return (
		<div
			onClick={() => {
				onSelectActiveWorkspace(workspace);
			}}
			className='flex items-center justify-between gap-2 cursor-pointer hover:bg-accent transition-colors duration-200 p-2 rounded-sm '>
			<div className='flex items-center gap-2'>
				<div
					className={`w-10 h-10 rounded-md shadow-sm text-white font-bold flex justify-center items-center ${workspaceColor}`}>
					{workspace.image ? (
						<Image
							priority
							className='w-full h-full object-cover rounded-md '
							src={workspace.image}
							alt='worksace image'
							height={300}
							width={300}
						/>
					) : (
						<p>{workspace.name[0].toUpperCase()}</p>
					)}
				</div>
				<p className='font-semibold '>{workspace.name}</p>
			</div>
			<Link
				target='_blank'
				onClick={(e) => {
					e.stopPropagation();
				}}
				href={`/dashboard/workspace/${workspace.id}`}
				className={buttonVariants({ variant: 'ghost', size: 'icon' })}>
				<ExternalLink />
			</Link>
		</div>
	);
};
