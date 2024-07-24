'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function CreateBlockNoteButton({ userId, workspaceId }: { userId: string; workspaceId: string }) {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleCreateBlockNote = async () => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/blocknote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: "Untitled",
          content: JSON.stringify([]),
          creatorId: userId,
          workspaceId: workspaceId, // Add this line
        }),
      });

      if (response.ok) {
        const newBlockNote = await response.json();
        router.push(`/blocknote/${newBlockNote.id}`);
      } else {
        console.error('Failed to create BlockNote');
      }
    } catch (error) {
      console.error('Error creating BlockNote:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Button
      onClick={handleCreateBlockNote}
      disabled={isCreating}
      className="w-full h-full flex items-center justify-center"
    >
      <PlusIcon className="mr-2" />
      {isCreating ? 'Creating...' : 'Create New BlockNote'}
    </Button>
  );
}