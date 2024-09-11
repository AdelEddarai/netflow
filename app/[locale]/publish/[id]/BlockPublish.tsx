"use client"

import React from 'react';
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { BlockNoteView } from '@blocknote/mantine';
import { BlockNoteEditor } from '@blocknote/core';

interface BlockNoteViewClientProps {
  initialContent: any;
}

export default function BlockNoteViewClient({ initialContent }: BlockNoteViewClientProps) {
  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent,
  });


  return (
    <BlockNoteView 
      editor={editor} 
      editable={false}
      // Add any additional props or styling options here
    />
  );
}