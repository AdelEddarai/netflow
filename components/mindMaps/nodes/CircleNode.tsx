"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NodeProps, useReactFlow } from 'reactflow';
import { NodeWrapper } from './NodeWrapper';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { TextNodeSchema, textNodeSchema } from '@/schema/nodesSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { MindMapItemColors } from '@/types/enums';
import { useAutosaveIndicator } from '@/context/AutosaveIndicator';
import { useAutoSaveMindMap } from '@/context/AutoSaveMindMap';
import { useDebouncedCallback } from 'use-debounce';
import { useTranslations } from 'next-intl';
import { Database } from 'lucide-react';

type NodeData = {
  text: string;
  color: MindMapItemColors;
  onDelete: () => void;
};

export const CircleNode = ({ data, id }: NodeProps<NodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const _nodeText = useRef<HTMLTextAreaElement>(null);
  const { setNodes } = useReactFlow();

  const { onSetStatus } = useAutosaveIndicator();
  const { onSave } = useAutoSaveMindMap();

  const t = useTranslations('MIND_MAP.NODE');

  const debouncedMindMapInfo = useDebouncedCallback(() => {
    onSetStatus('pending');
    onSave();
  }, 3000);

  const onSaveNode = useCallback(
    (nodeId: string, nodeText: string) => {
      setNodes((prevNodes) => {
        const nodes = prevNodes.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, text: nodeText } } : node
        );
        return nodes;
      });

      onSetStatus('unsaved');
      debouncedMindMapInfo();
    },
    [setNodes, debouncedMindMapInfo, onSetStatus]
  );

  const form = useForm<TextNodeSchema>({
    resolver: zodResolver(textNodeSchema),
    defaultValues: {
      text: t('PLACEHOLDER'),
    },
  });

  const { ref: nodeText, ...rest } = form.register('text');

  const onIsEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = (formData: TextNodeSchema) => {
    onSaveNode(id, formData.text);
    onIsEdit();
  };

  useEffect(() => {
    form.reset({
      text: data.text ? data.text : t('PLACEHOLDER'),
    });
  }, [data.text, form, isEditing, t]);

  return (
    <NodeWrapper
      nodeId={id}
      color={data.color}
      isEditing={isEditing}
      onIsEdit={onIsEdit}
      onDelete={data.onDelete}
    >
      <div className="w-32 h-32 rounded-full flex flex-col items-center justify-center overflow-hidden">
        <Database className="mb-2" size={24} />
        <div className="w-full px-2 text-center">
          {isEditing ? (
            <form id='node-text-form' onSubmit={form.handleSubmit(onSubmit)}>
              <TextareaAutosize
                placeholder={t('PLACEHOLDER')}
                {...rest}
                ref={(e) => {
                  nodeText(e);
                  // @ts-ignore
                  _nodeText.current = e;
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.preventDefault();
                }}
                className='w-full min-h-[2rem] resize-none appearance-none overflow-hidden bg-transparent placeholder:text-muted-foreground focus:outline-none text-center text-sm'
              />
              <div className='w-full flex justify-center mt-2 gap-1'>
                <Button
                  type='button'
                  onClick={onIsEdit}
                  variant={'ghost'}
                  className='py-0.5 px-1 h-fit text-xs'
                  size={'sm'}
                >
                  {t('CANCEL')}
                </Button>
                <Button
                  disabled={!form.formState.isValid}
                  variant={'ghost'}
                  type='submit'
                  className='py-0.5 px-1 h-fit text-xs'
                  size={'sm'}
                >
                  {t('SAVE')}
                </Button>
              </div>
            </form>
          ) : (
            <p className='w-full break-words text-sm cursor-pointer' onClick={onIsEdit}>
              {data.text ? data.text : t('PLACEHOLDER')}
            </p>
          )}
        </div>
      </div>
    </NodeWrapper>
  );
};