'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
	Background,
	applyNodeChanges,
	applyEdgeChanges,
	addEdge,
	Edge,
	OnNodesChange,
	OnEdgesChange,
	OnConnect,
	Node,
	EdgeTypes,
	Panel,
	ReactFlowJsonObject,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { TextNode } from './nodes/TextNode';
import { Button } from '@/components/ui/button';
import { EdgeOptions } from './EdgeOptions';
import { Sheet } from '@/components/ui/sheet';
import { EdgeOptionsSchema } from '@/schema/edgeOptionsSchema';
import { CustomStraight } from './labels/CustomStraight';
import { CustomStepSharp } from './labels/CustomStepSharp';
import { CustomStepRounded } from './labels/CustomStepRounded';
import { CustomBezier } from './labels/CustomBezier';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { PlusSquare, Save } from 'lucide-react';
import { DeleteAllNodes } from './DeleteAllNodes';
import { Tag } from '@prisma/client';
import { LoadingScreen } from '../common/LoadingScreen';
import { useDebouncedCallback } from 'use-debounce';
import { useAutosaveIndicator } from '@/context/AutosaveIndicator';
import { useAutoSaveMindMap } from '@/context/AutoSaveMindMap';
import { MindMapTagsSelector } from './MindMapTagsSelector';
import { Separator } from '../ui/separator';
import { EditInfo } from './editInfo/EditInfo';
import { ExtendedMindMap } from '@/types/extended';
import { useTranslations } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';

const nodeTypes = { textNode: TextNode };
const edgeTypes: EdgeTypes = {
	customBezier: CustomBezier,
	customStraight: CustomStraight,
	customStepSharp: CustomStepSharp,
	customStepRounded: CustomStepRounded,
};

interface Props {
	initialInfo: ExtendedMindMap;
	workspaceId: string;
	candEdit: boolean;
	initialActiveTags: Tag[];
}

export const MindMap = ({ initialInfo, workspaceId, candEdit, initialActiveTags }: Props) => {
	const [openSheet, setOpenSheet] = useState(false);

	const [nodes, setNodes] = useState<Node[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);

	const [clickedEdge, setClickedEdge] = useState<Edge | null>(null);

	const [isMounted, setIsMounted] = useState(false);
	const [editable, setEditable] = useState(candEdit);

	const { onSetStatus, status } = useAutosaveIndicator();
	const { setRfInstance, onSave, onSetIds } = useAutoSaveMindMap();

	const t = useTranslations('MIND_MAP');

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const debouncedMindMapInfo = useDebouncedCallback(() => {
		onSetStatus('pending');
		onSave();
	}, 3000);

	useEffect(() => {
		const { content } = initialInfo;
		if (content) {
			const { nodes = [], edges = [] } = content as unknown as ReactFlowJsonObject;
			setNodes(nodes);
			setEdges(edges);
		}
		onSetIds(initialInfo.id, workspaceId);
	}, [initialInfo, initialInfo.id, workspaceId, onSetIds]);

	const onNodesChange: OnNodesChange = useCallback(
		(changes) => {
			setNodes((nds) => {
				return applyNodeChanges(changes, nds);
			});
		},

		[]
	);

	useEffect(() => {
		setEditable(candEdit);
	}, [candEdit]);

	const onEdgesChange: OnEdgesChange = useCallback((changes) => {
		setEdges((eds) => {
			return applyEdgeChanges(changes, eds);
		});
	}, []);

	const onEdgeClick = useCallback(
		(e: React.MouseEvent, edge: Edge) => {
			if (!editable) return;
			setClickedEdge(edge);
			setOpenSheet(true);
		},
		[editable]
	);

	const onSaveEdge = useCallback(
		(data: EdgeOptionsSchema) => {
			const { animated, edgeId, label, color, type } = data;
			setEdges((prevEdges) => {
				const edges = prevEdges.map((edge) =>
					edge.id === edgeId
						? {
								...edge,
								data: label ? { label, color } : undefined,
								type,
								animated,
						  }
						: edge
				);

				return edges;
			});

			setOpenSheet(false);
			onSetStatus('unsaved');
			debouncedMindMapInfo();
		},
		[debouncedMindMapInfo, onSetStatus]
	);

	const onDeleteEdge = useCallback(
		(edgeId: string) => {
			setEdges((prevEdges) => {
				const edges = prevEdges.filter((edge) => edge.id !== edgeId);
				return edges;
			});
			setOpenSheet(false);
			onSetStatus('unsaved');
			debouncedMindMapInfo();
		},
		[debouncedMindMapInfo, onSetStatus]
	);

	const onNodeDrag = useCallback(() => {
		onSetStatus('unsaved');
		debouncedMindMapInfo();
	}, [debouncedMindMapInfo, onSetStatus]);

	const onNodesDelete = useCallback(() => {
		onSetStatus('unsaved');
		debouncedMindMapInfo();
	}, [debouncedMindMapInfo, onSetStatus]);

	const onConnect: OnConnect = useCallback(
		(params) => {
			setEdges((eds) => addEdge(params, eds));
			onSetStatus('unsaved');
			debouncedMindMapInfo();
		},
		[debouncedMindMapInfo, onSetStatus]
	);

	const onAddNode = useCallback(() => {
		const newNode = {
			id: uuidv4(),
			type: 'textNode',
			position: { x: 0, y: 0 },
			data: { text: '', color: 12, onDelete: onNodesDelete },
		};

		setNodes((nds) => nds.concat(newNode));
		onSetStatus('unsaved');
		debouncedMindMapInfo();
	}, [debouncedMindMapInfo, onSetStatus, onNodesDelete]);

	if (!isMounted) return <LoadingScreen />;

	return (
		<div className='w-full h-full flex flex-col'>
			{clickedEdge && (
				<Sheet open={openSheet} onOpenChange={setOpenSheet}>
					<EdgeOptions
						clickedEdge={clickedEdge}
						isOpen={openSheet}
						onSave={onSaveEdge}
						onDeleteEdge={onDeleteEdge}
					/>
				</Sheet>
			)}

			<div className=' h-full'>
				<ReactFlow
					fitView
					nodes={nodes}
					edgeTypes={edgeTypes}
					nodeTypes={nodeTypes}
					edges={edges}
					onInit={setRfInstance}
					onNodeDrag={onNodeDrag}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					onEdgeClick={onEdgeClick}
					onNodesDelete={onNodesDelete}
					connectOnClick={editable}
					edgesUpdatable={editable}
					edgesFocusable={editable}
					nodesDraggable={editable}
					nodesConnectable={editable}
					nodesFocusable={editable}
					elementsSelectable={editable}
					proOptions={{
						hideAttribution: true,
					}}>
					{editable && (
						<Panel
							position='top-left'
							className='bg-background  z-50 shadow-sm border rounded-sm py-0.5 px-3'>
							<div className=' flex gap-2 w-full items-center '>
								<HoverCard openDelay={250} closeDelay={250}>
									<HoverCardTrigger asChild>
										<Button variant={'ghost'} size={'icon'} onClick={onAddNode}>
											<PlusSquare size={20} />
										</Button>
									</HoverCardTrigger>
									<HoverCardContent align='start' sideOffset={8}>
										{t('HOVER_TIP.ADD_TILE')}
									</HoverCardContent>
								</HoverCard>
								<EditInfo
									emoji={initialInfo.emoji}
									title={initialInfo.title}
									mapId={initialInfo.id}
									workspaceId={workspaceId}
								/>

								<HoverCard openDelay={250} closeDelay={250}>
									<HoverCardTrigger asChild>
										<Button
											disabled={status === 'pending' || status === 'saved'}
											variant={'ghost'}
											size={'icon'}
											onClick={() => {
												onSetStatus('pending');
												onSave();
											}}>
											<Save size={20} />
										</Button>
									</HoverCardTrigger>
									<HoverCardContent align='start' sideOffset={8}>
										{t('HOVER_TIP.SAVE')}
									</HoverCardContent>
								</HoverCard>

								<DeleteAllNodes mindMapId={initialInfo.id} workspaceId={workspaceId} />
								<div className='h-8'>
									<Separator orientation='vertical' />
								</div>
								<MindMapTagsSelector
									initialActiveTags={initialActiveTags}
									mindMapId={initialInfo.id}
									isMounted={isMounted}
									workspaceId={workspaceId}
								/>
							</div>
						</Panel>
					)}

					<Background />
				</ReactFlow>
			</div>
		</div>
	);
};
