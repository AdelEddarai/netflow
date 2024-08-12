"use client"

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  Block,
  BlockNoteEditor,
  BlockNoteSchema,
  defaultBlockSpecs,
  filterSuggestionItems,
  insertOrUpdateBlock,
  PartialBlock,
} from "@blocknote/core";

import {
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


import { RiAlertFill } from "react-icons/ri";


import YPartyKitProvider from "y-partykit/provider";
import * as Y from "yjs";
import './JsonBlock.css'
import { CiCalendar } from "react-icons/ci";
import { Alert } from "./Alert";
import { Calendar } from './Calenderss'
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Toaster, toast } from 'sonner'
import { PiShareNetworkThin } from "react-icons/pi";
import { BsFiletypePdf } from "react-icons/bs";
import { CiImport } from "react-icons/ci";
import { CiExport } from "react-icons/ci";
import { TbTableExport } from "react-icons/tb";
import { PiSpinnerThin } from "react-icons/pi";

import { CommandDialogDemo } from "./SearchCommand";
import { PDF } from "./PdfBlock";
import CSVTable from "./CsvTable";
import ChartFiltering from "./ChartFiltering";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import html2canvas from 'html2canvas';
import { useTheme } from "next-themes";
import TextareaAutosize from 'react-textarea-autosize';
import { format } from 'date-fns';
import TextAreabove from "./Textareaabove";
import { Skeleton } from "@/components/ui/skeleton"
import { downloadPDF } from "./PdfUtils";
import { fencedCodeBlock } from "./CodeBlock";
import { TbCode } from 'react-icons/tb'
import { TbBlockquote } from 'react-icons/tb'
import { BlockQuoteBlock } from "./QuoteBlock";
import { Blockboard } from "./WhiteBoardBlock";
import { LineChart, PencilIcon } from "lucide-react";
import { ChartBlock } from "./ChartBlock";

import { Switch } from "@/components/ui/switch"
import { useParams } from "next/navigation";




// Our schema with block specs, which contain the configs and implementations for blocks
// that we want our editor to use.
const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    alert: Alert,
    calendar: Calendar,
    pdf: PDF,
    fencedCode: fencedCodeBlock,
    blockquote: BlockQuoteBlock,
    blockboard: Blockboard,
    chartblock: ChartBlock,
  },
});



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


// Function to insert a Calendar block
const insertCalendar = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Calendar",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "calendar",
    });
  },
  aliases: [
    "calendar",
    "event",
    "meeting",
    "appointment",
    "task",
  ],
  group: "Other",
  icon: <CiCalendar />,
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
  icon: <TbCode />,
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
  icon: <TbBlockquote />,
})

const isertBlockboard = (editor: typeof schema.BlockNoteEditor) => ({
  title: 'Blockboard',
  onItemClick: () => {
    editor.updateBlock(editor.getTextCursorPosition().block, {
      type: 'blockboard',
    })
  },
  aliases: ['board'],
  subtext: 'Used to define a block of text referenced from another source',
  group: 'Other',
  icon: <PencilIcon />,
})

const isertBlocChart = (editor: typeof schema.BlockNoteEditor) => ({
  title: 'ChartBlock',
  onItemClick: () => {
    editor.updateBlock(editor.getTextCursorPosition().block, {
      type: 'chartblock',
    })
  },
  aliases: ['charts'],
  subtext: 'Used to define a block of text referenced from another source',
  group: 'Other',
  icon: <LineChart />,
})




async function saveToStorage(jsonBlocks: Block[]) {
  // Simulate a save to storage function
  if (Math.random() < 0.1) {
    // Simulate a random failure
    throw new Error("Failed to save");
  }
  localStorage.setItem("editorContent", JSON.stringify(jsonBlocks));
}

async function loadFromStorage() {
  // Gets the previously stored editor contents.
  const storageString = localStorage.getItem("editorContent");
  return storageString
    ? (JSON.parse(storageString) as PartialBlock[])
    : undefined;
}

function SaveIndicator({ status }: { status: string }) {
  let colorClass;
  switch (status) {
    case "saving":
      colorClass = "bg-orange-500";
      break;
    case "error":
      colorClass = "bg-red-500";
      break;
    case "saved":
    default:
      colorClass = "bg-green-500";
      break;
  }

  return (
    <span
      className={`inline-block w-3 h-3 rounded-full ml-2 ${colorClass}`}
    ></span>
  );
}



interface Props {
	userId: string;
}


export default function App() {
  const [initialContent, setInitialContent] = useState<
    PartialBlock[] | undefined | "loading"
  >("loading");

  const { resolvedTheme } = useTheme();
  const [saveStatus, setSaveStatus] = useState("saved");
  // from block to json
  const [blocks, setBlocks] = useState<Block[]>([]);

  const [html, setHTML] = useState<string>("");

  const [markdown, setMarkdown] = useState<string>("");


  const [roomName, setRoomName] = useState("");
  const [username, setUsername] = useState("");
  const [userColor, setUserColor] = useState("#ff0000");
  const [provider, setProvider] = useState<YPartyKitProvider | null>(null);
  const [csvData, setCsvData] = useState<string>('');
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [title, setTitle] = useState('');
  const [creationDate] = useState(format(new Date(), 'MMMM d, yyyy'));

  const [searchTerm, setSearchTerm] = useState('');
  const [numericFilters, setNumericFilters] = useState<{ [key: string]: { condition: '>' | '<'; value: number } | null }>({});

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isAccordionVisible, setIsAccordionVisible] = useState(false);






  const handleSwitchChange = (checked: any) => {
    toast.success('it switched successfully')
    setIsAccordionVisible(checked);
  };

  const doc = useMemo(() => new Y.Doc(), []);

  const handleSaveRoomName = () => {
    toast.success(`the room was set successfully ${roomName}`)
    setProvider(
      new YPartyKitProvider(
        "blocknote-dev.yousefed.partykit.dev",
        roomName || "default-room",
        doc
      )
    );
  };


  useEffect(() => {
    if (provider) {
      // Add any logic needed when provider changes
    }
  }, [provider]);


  // Loads the previously stored editor contents.
  useEffect(() => {
    loadFromStorage().then((content) => {
      setInitialContent(content);
    });
  }, []);

  // Add new useEffect for skeleton loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);


  const editor = useMemo(() => {
    if (initialContent === "loading") {
      return undefined;
    }

    return BlockNoteEditor.create({
      collaboration: {
        provider,
        fragment: doc.getXmlFragment("document-store"),
        user: {
          name: username || "Default User",
          color: userColor || "#ff0000",
        },
      },
      schema,
      initialContent: initialContent || [
        {
          type: "paragraph",
          content: "Welcome to this demo!",
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "You can now toggle ", styles: {} },
            { type: "text", text: " and ", styles: {} },
            { type: "text", text: "code", styles: { code: true } },
            { type: "text", text: " styles with new buttons in the Formatting Toolbar", styles: {} },
          ],
        },
        {
          type: "paragraph",
          content: "Select some text to try them out",
        },
        {
          type: "paragraph",
          content: "Press the '/' key to open the Slash Menu and add another",
        },
        {
          type: "alert",
          content: "This is an example alert",
        },
        {
          type: "calendar",
          content: "This is an example calendar",
        },
      ],
      uploadFile,
    });
  }, [initialContent, provider, username, userColor]);


  const saveContent = useCallback(async () => {
    if (editor) {
      setSaveStatus("saving");
      try {
        // Convert the editor's contents to HTML and store it in the state.
        const html = await editor.blocksToHTMLLossy(editor.document);
        const markdown = await editor.blocksToMarkdownLossy(editor.document);
        setHTML(html);

        // Store the document JSON to state.
        setBlocks(editor.document as Block[]);
        setMarkdown(markdown);


        // Save the content to storage.
        await saveToStorage(editor.document as Block[]); // Cast to Block[] if necessary
        setSaveStatus("saved");
      } catch (error) {
        setSaveStatus("error");
      }
    } else {
      console.warn("Editor is not initialized.");
    }
  }, [editor]);



  // download html 
  const downloadHTML = () => {
    const element = document.createElement('a');
    const file = new Blob([html], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = 'editor_content.html';
    document.body.appendChild(element); // Required for this to work in Firefox
    element.click();
    toast.success('the file has succesfully download')
  };





  // download to pdf
  const handleDownloadPDF = () => {
    downloadPDF(html);
  };

  // Function to download HTML content as a PNG image
  const downloadPNG = () => {
    // Create a temporary element to hold the HTML content
    const element = document.createElement('div');
    element.innerHTML = html;

    // Set styles for proper rendering (optional)
    element.style.color = 'black';
    element.style.backgroundColor = 'white';
    element.style.padding = '10px';
    element.style.fontFamily = 'Arial, sans-serif';

    // Append the element to the document body
    document.body.appendChild(element);

    // Options for html2canvas conversion
    const options = {
      scale: 2, // Increase scale for better resolution
      logging: true, // Enable logging for troubleshooting
      backgroundColor: null, // Preserve transparency
    };

    // Convert HTML to canvas
    html2canvas(element, options).then(canvas => {
      // Create PNG image data URL from the canvas
      const imageDataURL = canvas.toDataURL('image/png');

      // Create a temporary anchor element
      const anchor = document.createElement('a');
      anchor.href = imageDataURL;
      anchor.download = 'editor_content.png';

      // Trigger a click event to download the PNG image
      anchor.click();

      // Clean up by removing the temporary elements
      document.body.removeChild(element);
    });
  };


  // CSV

  // function tableToCSV(table: HTMLTableElement): string {
  //   const rows = Array.from(table.querySelectorAll('tr'));

  //   const csvContent = rows.map(row => {
  //     const columns = Array.from(row.querySelectorAll('td, th'));
  //     const rowData = columns.map(column => column.textContent?.trim() || '').join(',');
  //     return rowData;
  //   }).join('\n');

  //   return csvContent;
  // }

  const tableToCSV = (table: HTMLTableElement): string => {
    const rows = Array.from(table.querySelectorAll('tr'));
    return rows.map(row =>
      Array.from(row.querySelectorAll('th, td'))
        .map(cell => cell.textContent?.trim() || '')
        .join(',')
    ).join('\n');
  };



  function downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if ((navigator as any).msSaveBlob) { // IE 10+
      (navigator as any).msSaveBlob(blob, filename);
    } else {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }


  const downloadTableAsCSV = () => {
    const table = document.querySelector('table'); // Adjust the selector as needed
    if (table) {
      const csvContent = tableToCSV(table);
      downloadCSV(csvContent, 'table_data.csv');
    } else {
      console.warn('No table found!');
    }
  };


  const handleVisualize = () => {
    setLoading(true);

    setTimeout(() => {
      const table = document.querySelector('table');
      if (table) {
        const csvContent = tableToCSV(table);
        setCsvData(csvContent);
        console.log('Visualizing table data');
        toast.success('Visualizing table data')
        // Add your visualization logic here
      } else {
        console.warn('No table found!');
        toast.warning('No table found!');
      }

      setLoading(false);
    }, 2000);
  };


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


  // import HTML parse it as a block

  const importHTML = useCallback(() => {
    if (!editor) {
      toast.error('Editor is not initialized');
      return;
    }

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.html';
    fileInput.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const htmlContent = event.target?.result as string;
          setHtmlContent(htmlContent);
          try {
            const blocks = await editor.tryParseHTMLToBlocks(htmlContent);
            editor.replaceBlocks(editor.document, blocks);
            toast.success('HTML content imported and inserted into the editor');
          } catch (error) {
            console.error('Error parsing HTML:', error);
            toast.error('Failed to parse HTML content');
          }
        };
        reader.readAsText(file);
      }
    };
    fileInput.click();
  }, [editor]);

  const htmlInputChanged = useCallback(
    async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHtmlContent(e.target.value);
      if (editor) {
        const blocks = await editor.tryParseHTMLToBlocks(e.target.value);
        editor.replaceBlocks(editor.document, blocks);
      }
    },
    [editor]
  );



  const handleChange = useCallback(() => {
    setSaveStatus("writing");
    setTimeout(() => setSaveStatus("saving"), 1000); // Move to saving after 1 second
    setTimeout(() => saveContent(), 2000); // Save content after 2 seconds
  }, [saveContent]);

  useEffect(() => {
    if (editor) {
      const handleSave = async () => {
        await saveContent();
      };

      const saveInterval = setInterval(handleSave, 5000); // Autosave every 5 seconds
      return () => clearInterval(saveInterval);
    }
  }, [editor, saveContent]);

  if (editor === undefined) {
    return "Loading content...";
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center sm:space-x-4">
  <div className="flex items-center space-x-4">
    <button onClick={saveContent}>
      {saveStatus === "saving" ? "Saving" : saveStatus === "pending" ? "Pending" : "Saved"}
    </button>
    <SaveIndicator status={saveStatus} />
    <div className='ml-28'>
      <Toaster richColors />
      <DropdownMenu>
        <div className='m-4'>
          <DropdownMenuTrigger> <Button variant="outline"> <CiExport /> </Button></DropdownMenuTrigger>
        </div>

        <DropdownMenuContent>
          <DropdownMenuLabel>Download as</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={downloadHTML}>Html</DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownloadPDF}>Pdf</DropdownMenuItem>
          <DropdownMenuItem onClick={downloadPNG}>Png</DropdownMenuItem>
          <DropdownMenuItem onClick={downloadTableAsCSV}>CSV <div>  <TbTableExport />  </div></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <DropdownMenu>
      <div className='m-4'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger> <Button variant="outline"> <CiImport /> </Button></DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Import</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <DropdownMenuContent>
        <DropdownMenuLabel>Import</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={importCSV}>CSV</DropdownMenuItem>
        <DropdownMenuItem onClick={importHTML}>HTML</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <AlertDialog>
      <div className='m-4'>
        <AlertDialogTrigger> <Button variant="outline"> <PiShareNetworkThin /> </Button> </AlertDialogTrigger>
      </div>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enter Room Details</AlertDialogTitle>
          <AlertDialogDescription>
            Please enter the name for the room, your username, and select a color.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="roomName">Room Name</Label>
            <Input id="roomName" value={roomName} onChange={(e) => setRoomName(e.target.value)} className="col-span-2 h-8" />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="col-span-2 h-8" />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="userColor">User Color</Label>
            <Input type="color" id="userColor" value={userColor} onChange={(e) => setUserColor(e.target.value)} className="col-span-2 h-8" />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSaveRoomName}>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <div className="hidden sm:block">
      <Button onClick={handleVisualize} variant={"outline"} disabled={loading}>
        {loading ? (
          <PiSpinnerThin className="animate-spin" />
        ) : (
          'Visualize Table Data'
        )}
      </Button>
    </div>

    <CommandDialogDemo />

    {/* Switch to dev mode for accordion */}
    <div className="hidden sm:flex items-center space-x-2">
      <Switch id="accordion-switch" onCheckedChange={handleSwitchChange} />
      <label htmlFor="accordion-switch">
        {isAccordionVisible ? "Hide Accordion" : "Show Accordion"}
      </label>
    </div>

  </div>
</div>

      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <>
            {/* Skeleton for cover image */}
            <Skeleton className="w-full h-48 mb-4" />

            {/* Skeleton for creation date */}
            <Skeleton className="w-1/4 h-4 mb-2" />

            {/* Skeleton for title */}
            <Skeleton className="w-3/4 h-8 mb-4" />

            {/* Skeleton for BlockNoteView */}
            <div className="space-y-2">
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-3/4 h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-5/6 h-6" />
            </div>
          </>
        ) : (
          <>

            {/* Cover Image */}
            <TextAreabove />

            {/* Creation Date */}
            <div className="text-sm text-gray-500 mb-2 ml-10">
              Created on {creationDate}
            </div>

            <div>
              <div className='ml-10'>
                <TextareaAutosize
                  className=" w-full text-4xl font-bold focus:outline-none resize-none overflow-hidden bg-transparent"
                  placeholder="Untitled"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxRows={3}
                />
              </div>
              <div className='pb-40 mr-8'>
                <BlockNoteView
                  editor={editor}
                  theme={resolvedTheme === "dark" ? customDarkTheme : "light"}
                  slashMenu={false}
                  onChange={handleChange}
                >

                  <SuggestionMenuController
                    triggerCharacter={"/"}
                    getItems={async (query) =>
                      filterSuggestionItems(
                        [...getDefaultReactSlashMenuItems(editor), insertAlert(editor), insertCalendar(editor), insertPDF(editor), insertFencedCodeBlock(editor), insertBlockQuote(editor), isertBlockboard(editor), isertBlocChart(editor)],
                        query
                      )
                    }
                  />
                </BlockNoteView>
              </div>
            </div>
          </>
        )}
      </div>


      <div className="space-y-4">
        {isAccordionVisible && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Analyze the Data</AccordionTrigger>
              <AccordionContent>
                <ChartFiltering
                  csvData={csvData}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  numericFilters={numericFilters}
                  setNumericFilters={setNumericFilters}
                />
                <CSVTable
                  csvData={csvData}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  numericFilters={numericFilters}
                  setNumericFilters={setNumericFilters}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>HTML</AccordionTrigger>
              <AccordionContent>
                <div className="item bordered">
                  <pre>
                    <code>{html}</code>
                  </pre>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Markdown</AccordionTrigger>
              <AccordionContent>
                <div className={"item bordered"}>
                  <pre>
                    <code>{markdown}</code>
                  </pre>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>JSON</AccordionTrigger>
              <AccordionContent>
                <div className={"item bordered"}>
                  <pre>
                    <code>{JSON.stringify(blocks, null, 2)}</code>
                  </pre>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Html Output</AccordionTrigger>
              <AccordionContent>
                <div className="mt-4">
                  <h3>HTML Input:</h3>
                  <textarea
                    value={htmlContent}
                    onChange={htmlInputChanged}
                    className="w-full h-32 p-2 border rounded"
                    placeholder="Paste or type HTML here"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  );
}