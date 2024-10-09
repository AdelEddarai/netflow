"use client"

import React from 'react';
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { BlockNoteEditor, Block } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import { useTheme } from 'next-themes';

interface BlockNoteViewClientProps {
  initialContent: Block[];
}

const customDarkTheme = {
  colors: {
    editor: {
      text: 'hsl(0, 0%, 95%)',
      background: 'hsl(20, 14.3%, 4.1%)',
    },
    menu: {
      text: 'hsl(0, 0%, 95%)',
      background: 'hsl(24, 9.8%, 10%)',
    },
    tooltip: {
      text: 'hsl(0, 0%, 95%)',
      background: 'hsl(0, 0%, 9%)',
    },
    hovered: {
      text: 'hsl(0, 0%, 95%)',
      background: 'hsl(240, 3.7%, 15.9%)',
    },
    selected: {
      text: 'hsl(144.9, 80.4%, 10%)',
      background: 'hsl(142.1, 70.6%, 45.3%)',
    },
    disabled: {
      text: 'hsl(240, 5%, 64.9%)',
      background: 'hsl(0, 0%, 15%)',
    },
    shadow: 'hsl(240, 3.7%, 15.9%)',
    border: 'hsl(240, 3.7%, 15.9%)',
  },
};

export default function BlockNoteViewClient({ initialContent, onChange }: BlockNoteViewClientProps) {
  const { resolvedTheme } = useTheme();
  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: Array.isArray(initialContent) ? initialContent : [initialContent],
  });


  return (
    <BlockNoteView
      editor={editor}
      theme={resolvedTheme === "dark" ? customDarkTheme : "light"}
      editable={false}
      slashMenu={false}
      formattingToolbar={false}
    />
  );
}
