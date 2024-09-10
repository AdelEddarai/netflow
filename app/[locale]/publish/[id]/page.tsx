import React from 'react';
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { gePublictBlockNoteById } from '../../dashboard/blocknote/action';
import { BlockNoteView } from '@blocknote/mantine';

export default async function PublicBlockNotePage({ params }: { params: { id: string } }) {
  const result = await gePublictBlockNoteById(params.id);

  if (!result.success) {
    return <div>Error: {result.error}</div>;
  }

  const { blockNote } = result;

  if (!blockNote) {
    return <div>Error: BlockNote not found</div>;
  }

  // Parse the content back to an object
  const content = JSON.parse(blockNote.content as string);

  // Client component for rendering BlockNoteView
  const BlockNoteViewClient = () => {
    const editor = useCreateBlockNote({
      initialContent: content,
    });

    return (
      <BlockNoteView editor={editor} editable={false} />
    );
  }

  return (
    <div>
      <h1>{blockNote.title}</h1>
      <BlockNoteViewClient />
      <p>Last updated: {new Date(blockNote.updatedAt).toLocaleString()}</p>
    </div>
  );
}