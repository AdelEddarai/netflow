'use client';
import { UseMutateFunction } from '@tanstack/react-query';
import axios from 'axios';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { ReactFlowInstance, ReactFlowJsonObject } from 'reactflow';
import { useAutosaveIndicator } from './AutosaveIndicator';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';

interface Props {
	children: React.ReactNode;
}
interface AutoSaveMindMapContex {
	onSave: () => void;
	setRfInstance: React.Dispatch<React.SetStateAction<ReactFlowInstance | null>>;
	onSetIds: (mindMapId: string, workspaceId: string) => void;
}

export const AutoSaveMindMapCtx = createContext<AutoSaveMindMapContex | null>(null);

export const AutoSaveMindMapProvider = ({ children }: Props) => {
	const [rfInstance, setRfInstance] = useState<null | ReactFlowInstance>(null);
	const { onSetStatus } = useAutosaveIndicator();
	const [ids, setIds] = useState<null | { mindMapId: string; workspaceId: string }>(null);

	const { toast } = useToast();

	const { mutate: updateMindMap } = useMutation({
		mutationFn: async (flow: ReactFlowJsonObject) => {
			await axios.post('/api/mind_maps/update/mind_map', {
				content: flow,
				mindMapId: ids?.mindMapId,
				workspaceId: ids?.workspaceId,
			});
		},

		onSuccess: () => {
			onSetStatus('saved');
		},

		onError: () => {
			onSetStatus('unsaved');
			toast({
				title: 'blad zapisywania',
				variant: 'destructive',
			});
		},
	});

	const onSetIds = useCallback((mindMapId: string, workspaceId: string) => {
		setIds({ mindMapId, workspaceId });
	}, []);

	const onSave = useCallback(() => {
		if (rfInstance && ids) {
			const flow = rfInstance.toObject();
			updateMindMap(flow);
		}
	}, [rfInstance, updateMindMap, ids]);

	return (
		<AutoSaveMindMapCtx.Provider value={{ setRfInstance, onSave, onSetIds }}>
			{children}
		</AutoSaveMindMapCtx.Provider>
	);
};

export const useAutoSaveMindMap = () => {
	const ctx = useContext(AutoSaveMindMapCtx);
	if (!ctx) throw new Error('invalid use');

	return ctx;
};
