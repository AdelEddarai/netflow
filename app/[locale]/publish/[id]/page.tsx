import React from 'react';
import { gePublictBlockNoteById } from '../../dashboard/blocknote/action';
import PublicBlockNotePageClient from './ClientPage';



export default async function PublicBlockNotePage({ params }: { params: { id: string } }) {
  const result = await gePublictBlockNoteById(params.id);


  if (!result.success) {
    return <div className="flex items-center justify-center h-screen bg-red-50 text-red-500">Error: {result.error}</div>;
  }

  const { blockNote } = result;

  if (!blockNote) {
    return <div className="flex items-center justify-center h-screen bg-yellow-50 text-yellow-700">Error: BlockNote not found</div>;
  }

  let content;
  if (typeof blockNote.content === 'string') {
    try {
      content = JSON.parse(blockNote.content);
    } catch (error) {
      console.error('Error parsing content:', error);
      return <div className="flex items-center justify-center h-screen bg-red-50 text-red-500">Error: Invalid content format</div>;
    }
  } else {
    content = blockNote.content;
  }

  return <PublicBlockNotePageClient blockNote={blockNote} content={content} />;
}