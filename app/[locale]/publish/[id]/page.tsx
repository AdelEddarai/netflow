import React from 'react';
import { gePublictBlockNoteById } from '../../dashboard/blocknote/action';
import PublicBlockNotePageClient from './ClientPage';
import { Block } from '@blocknote/core';

export default async function PublicBlockNotePage({ params }: { params: { id: string } }) {
  const result = await gePublictBlockNoteById(params.id);

  if (!result.success || !result.blockNote) {
    return <div>Error: {result.success || 'BlockNote not found'}</div>;
  }

  const { blockNote } = result;

  let content: Block[];
  try {
    content = typeof blockNote.content === 'string' ? JSON.parse(blockNote.content) : blockNote.content;
  } catch (error) {
    console.error('Error parsing content:', error);
    content = [];
  }

  // @ts-ignore
  return <PublicBlockNotePageClient blockNote={blockNote} content={content} />;
}
