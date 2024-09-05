'use client'

import { Block, BlockNoteEditor, BlockNoteSchema, defaultBlockSpecs, filterSuggestionItems, insertOrUpdateBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { FormattingToolbar, FormattingToolbarController, getDefaultReactSlashMenuItems, SuggestionMenuController, useBlockNote, useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import './JsonBlock.css'
import { getUserBlockNotes, saveBlockNote } from "../action";
import { useTheme } from "next-themes";
import TextareaAutosize from 'react-textarea-autosize';
import TextAreabove from "./Textareaabove";
import SaveStatusIndicator from "./SaveStatus";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from 'sonner'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { parse } from 'node-html-parser';
import { PartialBlock } from "@blocknote/core";
import { Alert } from "./Alert";
import { RiAlertFill } from "react-icons/ri";
import { Csviewer } from "./CsviewerBlock";
import { BlockQuoteBlock } from "./QuoteBlock";
import { PDF } from "./PdfBlock";
import { fencedCodeBlock } from "./CodeBlock";
import { BsChatQuote, BsCodeSlash, BsFiletypeCsv, BsFiletypePdf } from "react-icons/bs";
import TemplateCards from "./BlockTemplates/Blocktemplate";
import { ImMagicWand } from "react-icons/im";
import { useCompletion } from "ai/react";
import './aityping.css'
import FormattingToolbarComponent from "./FormatsToolbars";
import ChartVisualizer from "./DataDash/ChartVisulizer";
import { DiagramBlock } from "./DiagramBlock";


// For Blocks
const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    alert: Alert,
    csviewer: Csviewer,
    blockquote: BlockQuoteBlock,
    pdf: PDF,
    fencedCode: fencedCodeBlock,
    diagramblock: DiagramBlock
  },
});


export default function App() {
  const [blocks, setBlocks] = useState<Block[] | any>([]);
  const [title, setTitle] = useState<string>("Untitled");
  const [userBlockNotes, setUserBlockNotes] = useState<any[]>([]);
  const { resolvedTheme } = useTheme();
  const [saveStatus, setSaveStatus] = useState<'saved' | 'pending' | 'saving' | 'error'>('saved');
  const [html, setHTML] = useState<string>("");
  const [csvData, setCsvData] = useState<string>('');
  // for ai text typing
  const [aiText, setAiText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const aiOutputRef = useRef<HTMLDivElement>(null);
  // for data visulize
  const [tableData, setTableData] = useState<any[]>([]);
  const [showChart, setShowChart] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [xAxisKey, setXAxisKey] = useState<string>('');
  const [yAxisKeys, setYAxisKeys] = useState<string[]>([]);

  // Create the editor instance
  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "paragraph",
        content: "Welcome to this Netflow demo!",
      },
    ],
    uploadFile,
  });

  const { complete } = useCompletion({
    id: 'note_blocks',
    api: '/api/generate',
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error('Rate limit exceeded. Please try again later.');
        return;
      }
      if (response.body) {
        const reader = response.body.getReader();
        let decoder = new TextDecoder();

        setIsTyping(true);
        setAiText('');

        reader.read().then(function processText({ done, value }): Promise<void> {
          if (done) {
            setIsTyping(false);
            return Promise.resolve();
          }

          let chunk = decoder.decode(value, { stream: true });
          setAiText(prevText => prevText + chunk);

          return reader.read().then(processText);
        });
      } else {
        console.error('Response body is null');
        setIsTyping(false);
      }
    },
    onError: (e) => {
      console.error(e.message);
      toast.error('An error occurred while generating text.');
      setIsTyping(false);
    },
  });

  useEffect(() => {
    if (aiOutputRef.current) {
      aiOutputRef.current.scrollTop = aiOutputRef.current.scrollHeight;
    }
  }, [aiText]);

  const insertMagicAi = (editor: BlockNoteEditor) => {
    const prevText = editor._tiptapEditor.state.doc.textBetween(
      Math.max(0, editor._tiptapEditor.state.selection.from - 5000),
      editor._tiptapEditor.state.selection.from - 1,
      '\n'
    );
    setAiText('');  // Clear previous AI text
    complete(prevText);
  };

  const insertMagicItem = (editor: BlockNoteEditor) => ({
    title: 'Insert Magic Text',
    onItemClick: async () => {
      const prevText = editor._tiptapEditor.state.doc.textBetween(
        Math.max(0, editor._tiptapEditor.state.selection.from - 5000),
        editor._tiptapEditor.state.selection.from - 1,
        '\n'
      );
      insertMagicAi(editor);
    },
    aliases: ['autocomplete', 'ai'],
    group: 'AI',
    icon: <ImMagicWand size={18} />,
    subtext: 'Continue your note with AI-generated text',
  });

  // Function to convert AI-generated Markdown-style table to BlockNote.js format
  function convertAiTableToBlockNote(aiGeneratedTable: string): PartialBlock[] {
    const rows = aiGeneratedTable.trim().split('\n');
    const tableRows = rows.filter(row => !row.match(/^\s*\|[-:]+\|/)); // Remove separator row

    const tableBlock: PartialBlock = {
      type: "table",
      // @ts-ignore
      content: tableRows.map(row => ({
        type: "tableRow",
        content: row.split('|').filter(cell => cell.trim() !== '').map(cell => ({
          type: "tableCell",
          content: [{
            type: "paragraph",
            content: cell.trim()
          }]
        }))
      }))
    };

    return [tableBlock];
  }

  // Modified function to insert AI-generated content into the editor
  const insertAiTextIntoEditor = () => {
    if (aiText && editor) {
      const blocks: PartialBlock[] = [];
      // Updated regular expression without /s flag
      // @ts-ignore
      const parts = aiText.split(/(\|.*\|)/s);  // Split text and tables;

      parts.forEach(part => {
        if (part.trim().startsWith('|') && part.trim().endsWith('|')) {
          // This part is likely a table
          blocks.push(...convertAiTableToBlockNote(part));
        } else if (part.trim()) {
          // This is regular text
          blocks.push({
            type: "paragraph",
            content: part.trim()
          });
        }
      });

      editor.insertBlocks(
        blocks,
        editor.getTextCursorPosition().block,
        'after'
      );
      setAiText('');  // Clear AI text after inserting
    }
  };
  const handleHtmlDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([html], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${title}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // csv
  function htmlTableToCsv(html: string): string | null {
    const root = parse(html);
    const table = root.querySelector('table');

    if (!table) {
      return null; // No table found
    }

    const rows = table.querySelectorAll('tr');
    const csvRows = rows.map(row => {
      const cells = row.querySelectorAll('td, th');
      return cells.map(cell => {
        // Remove HTML tags and escape double quotes
        let content = cell.textContent.trim().replace(/"/g, '""');
        // Wrap content in double quotes if it contains commas or newlines
        if (content.includes(',') || content.includes('\n')) {
          content = `"${content}"`;
        }
        return content;
      }).join(',');
    });

    return csvRows.join('\n');
  }

  function handleCsvDownload(html: string) {
    const csv = htmlTableToCsv(html);

    if (csv) {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'table_data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      console.log('No table found in the HTML content');
      // You might want to show a message to the user here
    }
  }

  // In your component:
  const CsvDownloadButton: React.FC<{ html: string }> = ({ html }) => {
    return (
      <Button
        variant="outline"
        onClick={() => handleCsvDownload(html)}
      >
        Download CSV
      </Button>
    );
  };




  const handleContentChange = () => {
    setBlocks(editor.document);
    setSaveStatus('pending');

  };


  async function uploadFile(file: File) {
    const body = new FormData();
    body.append("file", file);

    const ret = await fetch("https://tmpfiles.org/api/v1/upload", {
      method: "POST",
      body: body,
    });
    return (await ret.json()).data.url.replace(
      "tmpfiles.org/",
      "tmpfiles.org/dl/"
    );
  }

  // Slash menu item to insert an Alert block
  const insertAlert = (editor: typeof schema.BlockNoteEditor) => ({
    title: "Alert",
    onItemClick: () => {
      insertOrUpdateBlock(editor, {
        type: "alert",
      });
    },
    aliases: [
      "alert",
      "notification",
      "emphasize",
      "warning",
      "error",
      "info",
      "success",
    ],
    group: "Other",
    icon: <RiAlertFill />,
  });

  // Slash menu item to insert an csv chart
  const insertCsviwer = (editor: typeof schema.BlockNoteEditor) => ({
    title: 'Csviewer',
    onItemClick: () => {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        type: 'csviewer',
      })
    },
    aliases: ['csv'],
    subtext: 'Used to define a block of text referenced from another source',
    group: 'Other',
    icon: <BsFiletypeCsv />,
  })

  const insertDiagram = (editor: typeof schema.BlockNoteEditor) => ({
    title: 'Diagram',
    onItemClick: () => {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        type: 'diagrams',
      })
    },
    aliases: ['graph'],
    subtext: 'Used to graph diagram using code',
    group: 'Other',
    icon: <BsFiletypeCsv />,
  })

  const insertBlockQuote = (editor: typeof schema.BlockNoteEditor) => ({
    title: 'Blockquote',
    onItemClick: () => {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        type: 'blockquote',
      })
    },
    aliases: ['quote'],
    subtext: 'Used to define a block of text referenced from another source',
    group: 'Other',
    icon: <BsChatQuote />,
  })

  // Slash menu item to insert a PDF block
  const insertPDF = (editor: typeof schema.BlockNoteEditor) => ({
    title: "PDF",
    onItemClick: () => {
      insertOrUpdateBlock(editor, {
        type: "pdf",
      });
    },
    aliases: ["pdf", "document", "embed", "file"],
    group: "Other",
    icon: <BsFiletypePdf />,
  });

  const insertFencedCodeBlock = (editor: typeof schema.BlockNoteEditor) => ({
    title: 'Fenced Code',
    onItemClick: () => {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        type: 'fencedCode',
      })
    },
    aliases: ['code'],
    group: 'Other',
    icon: <BsCodeSlash />,
  })


  const importCSV = useCallback(() => {
    if (!editor) {
      toast.error('Editor is not initialized');
      return;
    }

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';
    fileInput.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const csvContent = event.target?.result as string;
          setCsvData(csvContent);

          // Parse CSV to blocks
          const rows = csvContent.trim().split('\n');
          const headers = rows[0].split(',').map(header => header.trim());

          const blocks: PartialBlock[] = [
            {
              type: "paragraph",
              content: "Imported CSV Data:"
            },
            {
              type: "table",
              // @ts-ignore
              content: rows.map(row => ({
                type: "tableRow",
                content: row.split(',').map(cell => ({
                  type: "tableCell",
                  content: [{
                    type: "paragraph",
                    content: cell.trim()
                  }]
                }))
              }))
            }
          ];

          editor.replaceBlocks(editor.document, blocks);
          toast.success('CSV data imported and inserted into the editor');
        };
        reader.readAsText(file);
      }
    };
    fileInput.click();
  }, [editor]);

  useEffect(() => {
    fetchUserBlockNotes();
  }, []);

  const fetchUserBlockNotes = async () => {
    const result = await getUserBlockNotes();
    if (result.success) {
      setUserBlockNotes(result.blockNotes || []); // Provide a default empty array
    } else {
      console.error('Failed to fetch user BlockNotes:', result.error);
      setUserBlockNotes([]); // Set to empty array in case of error
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const result = await saveBlockNote(title, blocks);
      if (result.success) {
        setSaveStatus('saved');
        fetchUserBlockNotes(); // Refresh the list of BlockNotes
        toast.success('blocknote has been saved')
      } else {
        setSaveStatus('error');
        toast.error('Event has not been created' + result.error);
      }
    } catch (error) {
      console.error('Error saving BlockNote:', error);
      setSaveStatus('error');
      toast.error('an error has occurd')
    }
  };

  const tableToCSV = (table: HTMLTableElement): string => {
    const rows = Array.from(table.querySelectorAll('tr'));
    return rows.map(row =>
      Array.from(row.querySelectorAll('th, td'))
        .map(cell => cell.textContent?.trim() || '')
        .join(',')
    ).join('\n');
  };

  const handleVisualize = () => {
    const table = document.querySelector('table');
    if (table) {
      const csvContent = tableToCSV(table);
      setCsvData(csvContent);

      const rows = csvContent.split('\n');
      const headers = rows[0].split(',').map(header => header.trim());
      const parsedData = rows.slice(1).map(row => {
        const values = row.split(',');
        return headers.reduce((obj, header, index) => {
          obj[header] = isNaN(Number(values[index])) ? values[index] : Number(values[index]);
          return obj;
        }, {} as Record<string, string | number>);
      });

      setTableData(parsedData);
      setXAxisKey(headers[0]);
      setYAxisKeys(headers.slice(1));
      setShowChart(true);
      toast.success('Visualizing table data');
    } else {
      toast.warning('No table found!');
    }
  };

  
  // You need to reset the showChart and tableData states when a new table is created or the data changes
  useEffect(() => {
    setShowChart(false);
    setTableData([]);
  }, [blocks]);


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
    <div className={"wrapper"}>
      <div className="flex flex-col sm:flex-row items-center sm:space-x-4 mb-4">
        <div className="flex items-center space-x-4">
          <SaveStatusIndicator status={saveStatus} />
          <Toaster />
          <Button
            variant={"outline"}
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="px-4 py-2"
          >
            {saveStatus === 'saving' ? 'Saving...' : 'Save'}
          </Button>
          <DropdownMenu>
            <div className='m-4'>
              <DropdownMenuTrigger> <Button variant="outline"> Export </Button></DropdownMenuTrigger>
            </div>

            <DropdownMenuContent>
              <DropdownMenuLabel>Download as</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleHtmlDownload}>Html</DropdownMenuItem>
              <DropdownMenuItem>
                <CsvDownloadButton html={html} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant={"outline"} onClick={importCSV}>CSV</Button>

          <div className="flex items-center space-x-4">
            <Button variant={"outline"} onClick={handleVisualize}>
              Visualize Table
            </Button>
            <select 
              value={chartType} 
              onChange={(e) => setChartType(e.target.value as 'line' | 'bar')}
              className="p-2 border rounded"
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
            </select>
          </div>

        </div>
      </div>

      {/* Cover Image */}
      <TextAreabove />

      <div className='ml-10'>
        <TextareaAutosize
          className=" w-full text-4xl font-bold focus:outline-none resize-none overflow-hidden bg-transparent"
          value={title}
          placeholder="Untitled"
          onChange={(e) => setTitle(e.target.value)}
          maxRows={3}
        />
      </div>
      <div className={"item"}>
        <BlockNoteView
          editor={editor}
          theme={resolvedTheme === "dark" ? customDarkTheme : "light"}
          onChange={handleContentChange}
          slashMenu={false}
          formattingToolbar={false}
        >

          <FormattingToolbarController
            formattingToolbar={() => (
              <FormattingToolbar>
                <FormattingToolbarComponent />
              </FormattingToolbar>
            )}
          />
          <SuggestionMenuController
            triggerCharacter={"/"}
            getItems={async (query) =>
              filterSuggestionItems(
                [...getDefaultReactSlashMenuItems(editor), insertAlert(editor), insertCsviwer(editor), insertBlockQuote(editor), insertPDF(editor), insertFencedCodeBlock(editor), insertMagicItem(editor), insertDiagram(editor)],
                query
              )
            }
          />
        </BlockNoteView>
        {isTyping && (
          <div className="ai-typing-indicator">
            AI is typing...
          </div>
        )}

        {(isTyping || aiText) && (
          <div className="ai-output-container">
            <div ref={aiOutputRef} className="ai-output">
              {aiText}
            </div>
            <Button
              onClick={insertAiTextIntoEditor}
              disabled={!aiText}
              className="mt-2"
              variant={"outline"}
            >
              Insert AI Text
            </Button>
          </div>
        )}

      </div>



      {showChart && (
        <div className="mt-4">
          <ChartVisualizer 
            data={tableData} 
            title={title} 
            chartType={chartType}
            xAxisKey={xAxisKey}
            yAxisKeys={yAxisKeys}
          />
        </div>
      )}

      <TemplateCards
        // @ts-ignore
        editor={editor} />

    </div>
  );
}