'use client';

import React, { useState, useCallback } from 'react';
import { NodeProps, useReactFlow } from 'reactflow';
import { NodeWrapper } from './NodeWrapper';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MindMapItemColors } from '@/types/enums';
import { useAutosaveIndicator } from '@/context/AutosaveIndicator';
import { useAutoSaveMindMap } from '@/context/AutoSaveMindMap';
import { useDebouncedCallback } from 'use-debounce';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react'; // Import the Globe icon from lucide-react

const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

const HTTPNodeSchema = z.object({
  method: z.enum(httpMethods),
  url: z.string().url(),
  color: z.nativeEnum(MindMapItemColors),
});

type HTTPNodeData = z.infer<typeof HTTPNodeSchema>;

type NodeData = HTTPNodeData & {
  onDelete: () => void;
};

export const HTTPRequestNode = ({ data, id }: NodeProps<NodeData>) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const { onSetStatus } = useAutosaveIndicator();
  const { onSave } = useAutoSaveMindMap();
  const t = useTranslations('MIND_MAP.NODE');

  const debouncedMindMapInfo = useDebouncedCallback(() => {
    onSetStatus('pending');
    onSave();
  }, 3000);

  const form = useForm<HTTPNodeData>({
    resolver: zodResolver(HTTPNodeSchema),
    defaultValues: {
      method: data.method,
      url: data.url,
      color: data.color,
    },
  });

  const onSaveNode = useCallback(
    (nodeId: string, newData: HTTPNodeData) => {
      setNodes((prevNodes) => {
        const nodes = prevNodes.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
        );
        return nodes;
      });

      onSetStatus('unsaved');
      debouncedMindMapInfo();
      setIsOpen(false);
    },
    [setNodes, debouncedMindMapInfo, onSetStatus]
  );

  const onSubmit = (formData: HTTPNodeData) => {
    onSaveNode(id, formData);
  };

  return (
    <NodeWrapper
      nodeId={id}
      color={data.color}
      isEditing={isOpen}
      onIsEdit={() => setIsOpen(true)}
      onDelete={data.onDelete}
    >
      <div 
        className="w-48 h-32 flex flex-col items-center justify-center rounded-lg cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <Globe className="mb-2" size={36} /> {/* Larger Globe icon */}
        <div className="font-bold">{data.method}</div>
        <div className="text-sm truncate w-full text-center px-2">{data.url}</div>
      </div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('EDIT_HTTP_REQUEST')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="method">{t('HTTP_METHOD')}</Label>
              <Select onValueChange={(value) => form.setValue('method', value as any)} defaultValue={data.method}>
                <SelectTrigger>
                  <SelectValue placeholder={t('SELECT_METHOD')} />
                </SelectTrigger>
                <SelectContent>
                  {httpMethods.map((method) => (
                    <SelectItem key={method} value={method}>{method}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="url">{t('URL')}</Label>
              <Input {...form.register('url')} placeholder="https://example.com" />
            </div>
            <div>
              <Label htmlFor="color">{t('COLOR')}</Label>
              <Select onValueChange={(value) => form.setValue('color', parseInt(value) as MindMapItemColors)} defaultValue={data.color.toString()}>
                <SelectTrigger>
                  <SelectValue placeholder={t('SELECT_COLOR')} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(MindMapItemColors).map(([key, value]) => (
                    <SelectItem key={key} value={value.toString()}>{key}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>{t('CANCEL')}</Button>
              <Button type="submit">{t('SAVE')}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </NodeWrapper>
  );
};