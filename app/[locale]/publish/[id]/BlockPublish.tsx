"use client"

import React from 'react';
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { BlockNoteEditor, Block } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';

interface BlockNoteViewClientProps {
  initialContent: Block[];
}

export default function BlockNoteViewClient({ initialContent }: BlockNoteViewClientProps) {
  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: Array.isArray(initialContent) ? initialContent : [initialContent],
  });

  return (
    <BlockNoteView
      editor={editor}
      editable={false}
    />
  );
}