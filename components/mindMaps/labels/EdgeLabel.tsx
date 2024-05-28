'use client';
import { cn } from '@/lib/utils';
import { EdgeColor } from '@/types/enums';
import React, { useMemo } from 'react';
import { EdgeLabelRenderer, EdgeProps } from 'reactflow';

interface Props {
	label?: string;
	labelX: number;
	labelY: number;
	color: EdgeColor;
}

export const EdgeLabel = ({ label, labelX, labelY, color }: Props) => {
	const edgeColor = useMemo(() => {
		switch (color) {
			case EdgeColor.PURPLE:
				return 'bg-purple-600 border-purple-600  text-white';

			case EdgeColor.GREEN:
				return 'bg-green-600 border-green-600   text-white';

			case EdgeColor.RED:
				return 'bg-red-600 border-red-600  text-white';

			case EdgeColor.BLUE:
				return 'bg-blue-600 border-blue-600  text-white';

			case EdgeColor.CYAN:
				return 'bg-cyan-600 border-cyan-600  text-white';

			case EdgeColor.EMERALD:
				return 'bg-emerald-600 border-emerald-600  text-white';

			case EdgeColor.INDIGO:
				return 'bg-indigo-600 border-indigo-600 text-white';

			case EdgeColor.LIME:
				return 'bg-lime-600 border-lime-600  text-white';

			case EdgeColor.ORANGE:
				return 'bg-orange-600 border-orange-600  text-white';

			case EdgeColor.FUCHSIA:
				return 'bg-fuchsia-600 border-fuchsia-600  text-white';

			case EdgeColor.PINK:
				return 'bg-pink-600 border-pink-600 text-white';

			case EdgeColor.YELLOW:
				return 'bg-yellow-600 border-yellow-600  text-white';

			default:
				return 'bg-secondary border-secondary  text-secondary-foreground';
		}
	}, [color]);

	if (!label) return null;

	return (
		<EdgeLabelRenderer>
			<div
				style={{
					position: 'absolute',
					transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
				}}
				className={cn(
					`${edgeColor} font-semibold   text-sm px-3 py-1.5 rounded-sm shadow-sm max-w-[13rem]`
				)}>
				<p>{label}</p>
			</div>
		</EdgeLabelRenderer>
	);
};
