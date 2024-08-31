'use client'

import { Block, BlockNoteEditor, BlockNoteSchema, defaultBlockSpecs, filterSuggestionItems, insertOrUpdateBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { getDefaultReactSlashMenuItems, SuggestionMenuController, useBlockNote, useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import React, { useState, useEffect, ReactElement, useRef, useCallback } from "react";
import './JsonBlock.css'
import { getUserBlockNotes, saveBlockNote } from "../action";
import Link from "next/link";
import { useTheme } from "next-themes";
import TextareaAutosize from 'react-textarea-autosize';
import TextAreabove from "./Textareaabove";
import SaveStatusIndicator from "./SaveStatus";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from 'sonner'
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import htmlParser from 'html-react-parser';
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


interface Props {
  title: string;
  content: string;
}

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  content: {
    fontSize: 12,
    marginBottom: 10,
  },
  table: { 
    width: 'auto', 
    borderStyle: 'solid', 
    borderWidth: 1, 
    borderRightWidth: 0, 
    borderBottomWidth: 0 
  },
  tableRow: { 
    margin: 'auto', 
    flexDirection: 'row' 
  },
  tableCol: { 
    width: '25%', 
    borderStyle: 'solid', 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0 
  },
  tableCell: { 
    margin: 'auto', 
    marginTop: 5, 
    fontSize: 10 
  }
});


// Helper function to convert HTML to PDF-compatible components
const htmlToPdfComponents = (htmlContent: string): ReactElement[] => {
  const elements = htmlParser(htmlContent);
  
  const convertElement = (element: any): ReactElement => {
    if (typeof element === 'string') {
      return <Text>{element}</Text>;
    }

    switch (element.type) {
      case 'p':
        return <Text style={styles.content}>{React.Children.map(element.props.children, convertElement)}</Text>;
      case 'table':
        return (
          <View style={styles.table}>
            {React.Children.map(element.props.children, (row: any, i: number) => (
              <View style={styles.tableRow} key={i}>
                {React.Children.map(row.props.children, (cell: any, j: number) => (
                  <View style={styles.tableCol} key={j}>
                    <Text style={styles.tableCell}>{cell.props.children}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        );
      default:
        return <Text>{element.props.children}</Text>;
    }
  };

  return React.Children.map(elements, convertElement);
};

// PDF Document component
const MyDocument: React.FC<Props> = ({ title, content }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>
        {htmlToPdfComponents(content)}
      </View>
    </Page>
  </Document>
);

// For Blocks

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    alert: Alert,
    csviewer: Csviewer,
    blockquote: BlockQuoteBlock,
    pdf: PDF,
    fencedCode: fencedCodeBlock,
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

  const { complete } = useCompletion({
    id: 'note_blocks',
    api: '/api/generate',
    onResponse: (response) => {
      if (response.status === 429) {
        return;
      }
      if (response.body) {
        const reader = response.body.getReader();
        let decoder = new TextDecoder();

        reader.read().then(function processText({ done, value }) {
          if (done) {
            return;
          }

          let chunk = decoder.decode(value, { stream: true });

          editor?._tiptapEditor.commands.insertContent(chunk);

          reader.read().then(processText);
        });
      } else {
        console.error('Response body is null');
      }
    },
    onError: (e) => {
      console.error(e.message);
    },
  });

  const insertMagicAi = (editor: BlockNoteEditor) => {
    const prevText = editor._tiptapEditor.state.doc.textBetween(
        Math.max(0, editor._tiptapEditor.state.selection.from - 5000),
        editor._tiptapEditor.state.selection.from - 1,
        '\n'
    );
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

// Slash menu item to insert an Alert block
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
            <PDFDownloadLink
              document={<MyDocument title={title} content={html} />}
              fileName={`${title}.pdf`}
            >
              {({ blob, loading, error }) =>
                <Button
                  variant={"outline"}
                  disabled={loading}
                  className="px-4 py-2"
                >
                  {'Download PDF'}
                </Button>
              }
            </PDFDownloadLink>
            </DropdownMenuItem>
           <DropdownMenuItem>
            <CsvDownloadButton html={html} />
          </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
         <Button onClick={importCSV}>CSV</Button>

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
        >
          <SuggestionMenuController
                    triggerCharacter={"/"}
                    getItems={async (query) =>
                      filterSuggestionItems(
                        [...getDefaultReactSlashMenuItems(editor), insertAlert(editor), insertCsviwer(editor), insertBlockQuote(editor),insertPDF(editor), insertFencedCodeBlock(editor)],
                        query
                      )
                    }
                  />
           </BlockNoteView>       
      </div>

      <TemplateCards editor={editor} />

      {/* <div>Your BlockNotes:</div>
      <ul>
        {userBlockNotes.map((note) => (
          <>
            <li key={note.id}>
              <Link href={`/dashboard/blocknote/${note.id}`}>
                {note.title}
              </Link>
              - Last updated: {new Date(note.updatedAt).toLocaleString()}
            </li>
            {note.json}
          </>
        ))}
      </ul> */}
    </div>
  );
}