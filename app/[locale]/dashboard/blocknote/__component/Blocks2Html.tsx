"use client"

import { Block, BlockNoteEditor } from "@blocknote/core";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Function to convert blocks to HTML
const blocksToHTML = async (editor: BlockNoteEditor, blocks: Block[]): Promise<string> => {
  return editor.blocksToHTMLLossy(blocks);
};

// Custom hook to manage HTML conversion
const useHtmlConversion = (editor: BlockNoteEditor, blocks: Block[]) => {
  const [htmlOutput, setHtmlOutput] = useState<string>('');

  useEffect(() => {
    const convertBlocksToHtml = async () => {
      if (editor && blocks.length > 0) {
        try {
          const html = await blocksToHTML(editor, blocks);
          setHtmlOutput(html);
        } catch (error) {
          console.error('Error converting blocks to HTML:', error);
          setHtmlOutput('Error converting to HTML');
        }
      }
    };

    convertBlocksToHtml();
  }, [editor, blocks]);

  return htmlOutput;
};

// Component to display HTML output
const HtmlOutput: React.FC<{ html: string }> = ({ html }) => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>HTML Output</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="whitespace-pre-wrap text-sm">{html}</pre>
      </CardContent>
    </Card>
  );
};

export { useHtmlConversion, HtmlOutput };