// app/publish/[id]/page.tsx

import { Block } from "@blocknote/core";
import BlockNoteContent from "../../dashboard/blocknote/[id]/BlocknoteContent";
import { getBlockNoteById } from "../../dashboard/blocknote/action";

export default async function BlockNotePuplish({ params }: { params: { id: string } }) {
  const result = await getBlockNoteById(params.id);

  if (!result.success || !result.blockNote) {
    return <div>Error: {result.error || 'BlockNote not found'}</div>;
  }

  const { blockNote } = result;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{blockNote.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        Last updated: {new Date(blockNote.updatedAt).toLocaleString()}
      </p>
      <BlockNoteContent content={blockNote.content} />
    </div>
  );
}