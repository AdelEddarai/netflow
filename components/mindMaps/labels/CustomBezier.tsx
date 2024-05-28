import React from 'react';
import { EdgeProps, EdgeLabelRenderer, BaseEdge, getBezierPath } from 'reactflow';
import { EdgeLabel } from './EdgeLabel';

interface Props extends EdgeProps {}

export const CustomBezier = ({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	data,
}: Props) => {
	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	return (
		<>
			<BaseEdge id={id} path={edgePath} />
			<EdgeLabelRenderer>
				<EdgeLabel labelY={labelY} labelX={labelX} label={data?.label} color={data?.color} />
			</EdgeLabelRenderer>
		</>
	);
};
