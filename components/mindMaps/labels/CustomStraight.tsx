import React from 'react';
import { EdgeProps, EdgeLabelRenderer, BaseEdge, getStraightPath } from 'reactflow';
import { EdgeLabel } from './EdgeLabel';

interface Props extends EdgeProps {}

export const CustomStraight = ({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	style = {},
	markerEnd,
	data,
}: Props) => {
	const [edgePath, labelX, labelY] = getStraightPath({
		sourceX,
		sourceY,
		targetX,
		targetY,
	});


	return (
		<>
			<BaseEdge path={edgePath} id={id} markerEnd={markerEnd} style={style} />
			<EdgeLabelRenderer>
				<EdgeLabel labelY={labelY} labelX={labelX} label={data?.label} color={data?.color} />
			</EdgeLabelRenderer>
		</>
	);
};
