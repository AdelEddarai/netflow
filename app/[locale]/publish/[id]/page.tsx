import React from 'react';
import { gePublictBlockNoteById } from '../../dashboard/blocknote/action';
import dynamic from 'next/dynamic';

// Import the client component dynamically with ssr disabled
const BlockNoteViewClient = dynamic(
  () => import('./BlocknoteViewClient'),
  { ssr: false }
);

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

  return (
    <div>
      <h1>{blockNote.title}</h1>
      <BlockNoteViewClient initialContent={content} />
      <p>Last updated: {new Date(blockNote.updatedAt).toLocaleString()}</p>
    </div>
  );
}