'use client';

import React from 'react';
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { BlockNoteView } from '@blocknote/mantine';

interface BlockNoteViewClientProps {
  initialContent: any;
}

export default function BlockNoteViewClient({ initialContent }: BlockNoteViewClientProps) {
  const editor = useCreateBlockNote({
    initialContent: initialContent,
  });

  return (
    <BlockNoteView editor={editor} editable={false} />
  );
}