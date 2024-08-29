// app/dashboard/blocknote/[id]/edit/page.tsx
'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Block } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { getBlockNoteById, updateBlockNote } from "../../../blocknote/action";
import { Button } from '@/components/ui/button';

export default function EditBlockNotePage({ params }: { params: { id: string } }) {
  const [blockNote, setBlockNote] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "Loading content..."
      }
    ],
  });

  useEffect(() => {
    const fetchBlockNote = async () => {
      const result = await getBlockNoteById(params.id);
      if (result.success && result.blockNote) {
        setBlockNote(result.blockNote);
        setTitle(result.blockNote.title);
        const content = result.blockNote.content as Block[];
        setBlocks(content);
        if (content.length > 0) {
          editor.replaceBlocks(editor.document, content);
        }
      } else {
        setError(result.error || 'Failed to fetch BlockNote');
      }
    };

    fetchBlockNote();
  }, [params.id, editor]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateBlockNote(params.id, title, editor.document);
      if (result.success) {
        alert('BlockNote updated successfully!');
        router.push('/dashboard');
      } else {
        setError('Failed to update BlockNote: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating BlockNote:', error);
      setError('An error occurred while updating');
    } finally {
      setIsSaving(false);
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!blockNote) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-2xl font-bold mb-4 w-full p-2 border rounded"
      />
      <p className="text-sm text-gray-500 mb-4">
        Last updated: {new Date(blockNote.updatedAt).toLocaleString()}
      </p>
      <div className="border rounded-lg p-4 mb-4">
        <BlockNoteView editor={editor} />
      </div>
      <Button
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
}