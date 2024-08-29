"use client"

import React from "react";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import { BlockNoteView } from "@blocknote/mantine";

interface BlockNoteContentProps {
  content: any;
}

const BlockNoteContent: React.FC<BlockNoteContentProps> = ({ content }) => {
  const { resolvedTheme } = useTheme();

  // Function to safely parse content
  const parseContent = (rawContent: any): any[] => {
    if (Array.isArray(rawContent)) {
      return rawContent;
    }
    if (typeof rawContent === 'string') {
      try {
        const parsedContent = JSON.parse(rawContent);
        return Array.isArray(parsedContent) ? parsedContent : [];
      } catch {
        console.error("Failed to parse content string");
        return [];
      }
    }
    console.error("Unrecognized content format");
    return [];
  };

  const editor = useCreateBlockNote({
    initialContent: parseContent(content),
    // We're not specifying a custom schema here, allowing BlockNote to handle any block type
  });

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

  return (
    <div className="border rounded-lg p-4">
      <BlockNoteView 
        editor={editor}
        editable={false}
        theme={resolvedTheme === "dark" ? customDarkTheme : "light"}
      />
    </div>
  );
}

export default BlockNoteContent;