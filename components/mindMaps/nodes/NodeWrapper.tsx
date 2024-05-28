'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { MindMapItemColors } from '@/types/enums';
import { Check, MoreHorizontal, Palette, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Handle, Position, useReactFlow } from 'reactflow';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSubContent,
	DropdownMenuPortal,
	DropdownMenuSubTrigger,
	DropdownMenuSub,
} from '@/components/ui/dropdown-menu';
import { useAutosaveIndicator } from '@/context/AutosaveIndicator';
import { useDebouncedCallback } from 'use-debounce';
import { useAutoSaveMindMap } from '@/context/AutoSaveMindMap';
import { useTranslations } from 'next-intl';

interface Props {
	nodeId: string;
	children: React.ReactNode;
	className?: string;
	color?: MindMapItemColors;
	isEditing: boolean;
	onIsEdit: () => void;
	onDelete: () => void;
}

const colors = [
	MindMapItemColors.DEFAULT,
	MindMapItemColors.PURPLE,
	MindMapItemColors.GREEN,
	MindMapItemColors.BLUE,
	MindMapItemColors.CYAN,
	MindMapItemColors.EMERALD,
	MindMapItemColors.INDIGO,
	MindMapItemColors.LIME,
	MindMapItemColors.ORANGE,
	MindMapItemColors.FUCHSIA,
	MindMapItemColors.PINK,
	MindMapItemColors.YELLOW,
];

export const NodeWrapper = ({
	nodeId,
	children,
	className,
	color = MindMapItemColors.DEFAULT,
	isEditing,
	onIsEdit,
	onDelete,
}: Props) => {
	const [currColor, setCurrColor] = useState<MindMapItemColors | undefined>(color);
	const { setNodes } = useReactFlow();

	const { onSetStatus } = useAutosaveIndicator();
	const { onSave } = useAutoSaveMindMap();

	const t = useTranslations('MIND_MAP.NODE');

	const debouncedMindMapInfo = useDebouncedCallback(() => {
		onSetStatus('pending');
		onSave();
	}, 3000);

	const onSaveNode = useCallback(
		(color: MindMapItemColors) => {
			setNodes((prevNodes) => {
				const nodes = prevNodes.map((node) =>
					node.id === nodeId ? { ...node, data: { ...node.data, color } } : node
				);
				return nodes;
			});

			onSetStatus('unsaved');
			debouncedMindMapInfo();
		},
		[setNodes, nodeId, debouncedMindMapInfo, onSetStatus]
	);

	const onDeleteNode = useCallback(() => {
		setNodes((prevNodes) => {
			const nodes = prevNodes.filter((node) => node.id !== nodeId);

			return nodes;
		});
		onDelete();
	}, [setNodes, nodeId, onDelete]);

	const onColorSelect = useCallback(
		(newColor: MindMapItemColors) => {
			setCurrColor(newColor);
			onSaveNode(newColor);
		},
		[onSaveNode]
	);

	const nodeColor = useCallback((color: MindMapItemColors) => {
		switch (color) {
			case MindMapItemColors.PURPLE:
				return '!bg-purple-600 hover:bg-purple-500 text-white';

			case MindMapItemColors.GREEN:
				return '!bg-green-600 hover:bg-green-500 text-white';

			case MindMapItemColors.RED:
				return '!bg-red-600 hover:bg-red-500 text-white';

			case MindMapItemColors.BLUE:
				return '!bg-blue-600 hover:bg-blue-500 text-white';

			case MindMapItemColors.CYAN:
				return '!bg-cyan-600 hover:bg-cyan-500 text-white';

			case MindMapItemColors.EMERALD:
				return '!bg-emerald-600 hover:bg-emerald-500 text-white';

			case MindMapItemColors.INDIGO:
				return '!bg-indigo-600 hover:bg-indigo-500 text-white';

			case MindMapItemColors.LIME:
				return '!bg-lime-600 hover:bg-lime-500 text-white';

			case MindMapItemColors.ORANGE:
				return '!bg-orange-600 hover:bg-orange-500 text-white';
			case MindMapItemColors.FUCHSIA:
				return '!bg-fuchsia-600 hover:bg-fuchsia-500 text-white';

			case MindMapItemColors.PINK:
				return '!bg-pink-600 hover:bg-pink-500 text-white';

			case MindMapItemColors.YELLOW:
				return '!bg-yellow-600 hover:bg-yellow-500 text-white';

			default:
				return '!bg-secondary ';
		}
	}, []);

	return (
		<div
			className={cn(
				`min-w-[10rem] max-w-md text-xs px-3 py-1.5  rounded-sm shadow-sm flex items-start justify-between transition-colors duration-200 gap-4 ${nodeColor(
					currColor!
				)}`,
				className
			)}>
			<div className={` ${isEditing ? 'w-full' : 'w-[90%]'}  text-lg`}>
				{children}
				<>
					<Handle
						type='target'
						position={Position.Left}
						className={` transition-colors !border-popover duration-200 p-1 ${nodeColor(
							currColor!
						)}`}
					/>
					<Handle
						type='source'
						position={Position.Right}
						className={`transition-colors !border-popover duration-200 p-1  ${nodeColor(
							currColor!
						)}`}
					/>
				</>
			</div>
			{!isEditing && (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							className={`w-6 h-6 hover:bg-transparent  ${
								currColor === MindMapItemColors.DEFAULT ? '' : 'text-white hover:text-white'
							}  `}
							variant={'ghost'}
							size={'icon'}>
							<MoreHorizontal size={16} />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className='' sideOffset={-10} align='start'>
						<DropdownMenuItem
							onClick={() => {
								onIsEdit();
							}}
							className='cursor-pointer gap-2'>
							<Pencil size={16} />
							<span>{t('EDIT')}</span>
						</DropdownMenuItem>
						<DropdownMenuGroup>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger className='cursor-pointer gap-2'>
									<Palette size={16} />
									<span>{t('COLOR')}</span>
								</DropdownMenuSubTrigger>
								<DropdownMenuPortal>
									<DropdownMenuSubContent className='hover:bg-popover' sideOffset={10}>
										<DropdownMenuItem className='grid grid-cols-4 gap-2 focus:bg-popover  '>
											{colors.map((color, i) => (
												<Button
													onClick={() => {
														onColorSelect(color);
													}}
													key={i}
													className={`w-5 h-5 p-1  rounded-full ${nodeColor(color)} `}
													size={'icon'}
													variant={'ghost'}>
													{color === currColor && (
														<Check
															className={`${
																color !== MindMapItemColors.DEFAULT ? 'text-white' : ''
															}`}
															size={16}
														/>
													)}
												</Button>
											))}
										</DropdownMenuItem>
									</DropdownMenuSubContent>
								</DropdownMenuPortal>
							</DropdownMenuSub>
						</DropdownMenuGroup>
						<DropdownMenuItem
							onClick={() => {
								onDeleteNode();
							}}
							className='cursor-pointer gap-2'>
							<Trash size={16} />
							{t('DELETE')}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</div>
	);
};
