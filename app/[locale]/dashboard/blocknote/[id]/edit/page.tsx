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
import { saveAs } from 'file-saver';
import { Skeleton } from "@/components/ui/skeleton";

export default function EditBlockNotePage({ params }: { params: { id: string } }) {
  const [blockNote, setBlockNote] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const editor = useCreateBlockNote({
    initialContent: [],
  });

  useEffect(() => {
    const fetchBlockNote = async () => {
      setIsLoading(true);
      const result = await getBlockNoteById(params.id);
      if (result.success && result.blockNote) {
        setBlockNote(result.blockNote);
        setTitle(result.blockNote.title);
        const content = result.blockNote.content as Block[];
        setBlocks(content);
        if (content.length > 0) {
          editor.replaceBlocks(editor.document, content);
          const markdown = await editor.blocksToMarkdownLossy(content);
          setMarkdownContent(markdown);
        }
      } else {
        setError(result.error || 'Failed to fetch BlockNote');
      }
      setIsLoading(false);
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

  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, `${title}.md`);
  };

  if (error) return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      {isLoading ? (
        <Skeleton className="w-full h-8 mb-4" />
      ) : (
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-bold mb-4 w-full p-2 border rounded"
        />
      )}
      {isLoading ? (
        <Skeleton className="w-full h-4 mb-4" />
      ) : (
        <p className="text-sm text-gray-500 mb-4">
          Last updated: {new Date(blockNote?.updatedAt).toLocaleString()}
        </p>
      )}
      <div className="border rounded-lg p-4 mb-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-3/4 h-4" />
            <Skeleton className="w-1/2 h-4" />
          </div>
        ) : (
          <BlockNoteView editor={editor} />
        )}
      </div>
      <div className="flex space-x-2">
        <Button
          onClick={handleSave}
          disabled={isSaving || isLoading}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          variant="outline"
          onClick={handleDownloadMarkdown}
          disabled={isLoading}
        >
          Download Markdown
        </Button>
      </div>
    </div>
  );
}
