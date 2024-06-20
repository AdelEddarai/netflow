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
import "@blocknote/core/fonts/inter.css";
import {
  DefaultReactSuggestionItem,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import {
  BasicTextStyleButton,
  BlockTypeSelect,
  ColorStyleButton,
  CreateLinkButton,
  FileCaptionButton,
  FileReplaceButton,
  FormattingToolbar,
  FormattingToolbarController,
  NestBlockButton,
  TextAlignButton,
  UnnestBlockButton,
  useCreateBlockNote,
} from "@blocknote/react";


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
import { HiOutlineGlobeAlt } from "react-icons/hi";


import YPartyKitProvider from "y-partykit/provider";
import * as Y from "yjs";
import './JsonBlock.css'
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';

import { CiCalendar } from "react-icons/ci";
import { Alert } from "./Alert";
import { Calendar } from './Calenderss'
import QuoteBlock from "./Quote"

import { FaCode } from "react-icons/fa"; 


// Sets up Yjs document and PartyKit Yjs provider.
const doc = new Y.Doc();
const provider = new YPartyKitProvider(
  "blocknote-dev.yousefed.partykit.dev",
  // Use a unique name as a "room" for your application.
  "bytona",
  doc
);


// Our schema with block specs, which contain the configs and implementations for blocks
// that we want our editor to use.
const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    alert: Alert,
    calendar: Calendar,
    quote: QuoteBlock,
    // tldrawblock: TldrawBlock,
  },
});

// Custom Slash Menu item to insert a block after the current one.
const insertHelloWorldItem = (editor: BlockNoteEditor) => ({
  title: "Insert Hello World",
  onItemClick: () => {
    // Block that the text cursor is currently in.
    const currentBlock = editor.getTextCursorPosition().block;

    // New block we want to insert.
    const helloWorldBlock: PartialBlock = {
      type: "paragraph",
      content: [{ type: "text", text: "Hello World", styles: { bold: true } }],
    };

    // Inserting the new block after the current one.
    editor.insertBlocks([helloWorldBlock], currentBlock, "after");
  },
  aliases: ["helloworld", "hw"],
  group: "Other",
  icon: <HiOutlineGlobeAlt size={18} />,
  subtext: "Used to insert a block with 'Hello World' below.",
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

const insertQuote = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Quote",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "quote",
    });
  },
  aliases: [
    "quote",
    "citation",
    "quotation",
  ],
  group: "Other",
  icon: <CiCalendar />, // Assuming MdFormatQuote is imported from react-icons/md
});


// const insertCode = (editor: typeof schema.BlockNoteEditor) => ({
//   title: "Code",
//   onItemClick: () => {
//     insertOrUpdateBlock(editor, {
//       type: "code",
//       props: {
//         language: "javascript", // Default language
//         textAlignment: "left",
//         textColor: "#000000",
//       },
//     });
//   },
//   aliases: [
//     "code",
//     "snippet",
//     "programming",
//   ],
//   group: "Other",
//   icon: <FaCode />, // Code icon from react-icons/fa
// });

// const insertTldrawBlock = (editor: typeof schema.BlockNoteEditor) => ({
//   title: "Tldraw",
//   onItemClick: () => {
//     insertOrUpdateBlock(editor, {
//       type: "tldraw",
//     });
//   },
//   aliases: [
//     "tldraw",
//     "drawing",
//     "sketch",
//     // Add other aliases as needed
//   ],
//   group: "Other",
//   icon: <RiAlertFill />,
// });



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



export default function App() {
  const [initialContent, setInitialContent] = useState<
    PartialBlock[] | undefined | "loading"
  >("loading");
  const [saveStatus, setSaveStatus] = useState("saved");
  // from block to json
  const [blocks, setBlocks] = useState<Block[]>([]);

  const [html, setHTML] = useState<string>("");

  const [markdown, setMarkdown] = useState<string>("");




  // Loads the previously stored editor contents.
  useEffect(() => {
    loadFromStorage().then((content) => {
      setInitialContent(content);
    });
  }, []);

  const editor = useMemo(() => {
    if (initialContent === "loading") {
      return undefined;
    }

    return BlockNoteEditor.create({
      collaboration: {
        // The Yjs Provider responsible for transporting updates:
        provider,
        // Where to store BlockNote data in the Y.Doc:
        fragment: doc.getXmlFragment("document-store"),
        // Information (name and color) for this user:
        user: {
          name: "My Username",
          color: "#ff0000",
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
            {
              type: "text",
              text: "You can now toggle ",
              styles: {},
            },
            {
              type: "text",
              text: " and ",
              styles: {},
            },
            {
              type: "text",
              text: "code",
              styles: { code: true },
            },
            {
              type: "text",
              text: " styles with new buttons in the Formatting Toolbar",
              styles: {},
            },
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
  }, [initialContent]);



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
  };



  function getImageType(content: string): string {
    // Assuming 'content' contains HTML content with images
    // Extract image URLs from the content
    const imageUrls = content.match(/<img[^>]+src="(http[s]?:\/\/[^">]+)"/gi) || [];

    // Iterate through the image URLs to determine their types
    for (const imageUrl of imageUrls) {
      if (imageUrl.endsWith('.png')) {
        return 'png';
      } else if (imageUrl.endsWith('.jpg') || imageUrl.endsWith('.jpeg')) {
        return 'jpeg';
      } else if (imageUrl.endsWith('.webp')) {
        return 'webp';
      } // Add support for other image types as needed
    }

    // Default to JPEG if no specific type is detected
    return 'jpeg';
  }


  // download to pdf
  const downloadPDF = () => {
    // Create a temporary element to hold the HTML content
    const element = document.createElement('div');
    element.innerHTML = html;

    element.style.color = 'black';

    document.body.appendChild(element);

    // Options for html2pdf conversion
    const opt = {
      margin: 0.5,
      filename: 'editor_content.pdf',
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Check the image types and adjust the configuration accordingly
    const imageType = getImageType(html); // Assuming 'html' contains your HTML content
    if (imageType === 'png') {
      opt.image.type = 'png';
    } else if (imageType === 'jpeg') {
      opt.image.type = 'jpeg';
    } else if (imageType === 'webp') {
      opt.image.type = 'webp';
    } // Add support for other image types as needed

    // Convert HTML to PDF and save
    html2pdf().from(element).set(opt).save();

    // Clean up by removing the temporary element
    document.body.removeChild(element);
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





  return (
    <div>
      <div className="flex items-center space-x-4 mt-2">
        <button onClick={saveContent}>
          {saveStatus === "saving" ? "Saving" : saveStatus === "pending" ? "Pending" : "Saved"}
        </button>
        <SaveIndicator status={saveStatus} />

        <div className='ml-28'>
          <DropdownMenu>
            <DropdownMenuTrigger>Downlaod</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Download as</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={downloadHTML}>Html</DropdownMenuItem>
              <DropdownMenuItem onClick={downloadPDF}>Pdf</DropdownMenuItem>
              <DropdownMenuItem onClick={downloadPNG}>Png</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>


        {/* <button onClick={downloadHTML}> <SlCloudDownload size={20} className="mr-2" /> download as html</button>
        <button onClick={downloadPDF}>Download PDF</button>
        <button onClick={downloadPNG}>Download as PNG</button> */}
      </div>

      <BlockNoteView
        className="w-full h-full bg-gray-950"
        editor={editor}

        slashMenu={false}
        onChange={handleChange}
      >
        {/* the formatting is when u select a word it pops up a items */}
        <FormattingToolbarController
          formattingToolbar={() => (
            <FormattingToolbar>
              <BlockTypeSelect key={"blockTypeSelect"} />

              {/* Extra button to toggle blue text & background */}
              {/* <BlueButton key={"customButton"} /> */}

              <FileCaptionButton key={"fileCaptionButton"} />
              <FileReplaceButton key={"replaceFileButton"} />

              <BasicTextStyleButton
                basicTextStyle={"bold"}
                key={"boldStyleButton"}
              />
              <BasicTextStyleButton
                basicTextStyle={"italic"}
                key={"italicStyleButton"}
              />
              <BasicTextStyleButton
                basicTextStyle={"underline"}
                key={"underlineStyleButton"}
              />
              <BasicTextStyleButton
                basicTextStyle={"strike"}
                key={"strikeStyleButton"}
              />
              {/* Extra button to toggle code styles */}
              <BasicTextStyleButton
                key={"codeStyleButton"}
                basicTextStyle={"code"}
              />

              <TextAlignButton
                textAlignment={"left"}
                key={"textAlignLeftButton"}
              />
              <TextAlignButton
                textAlignment={"center"}
                key={"textAlignCenterButton"}
              />
              <TextAlignButton
                textAlignment={"right"}
                key={"textAlignRightButton"}
              />

              <ColorStyleButton key={"colorStyleButton"} />

              <NestBlockButton key={"nestBlockButton"} />
              <UnnestBlockButton key={"unnestBlockButton"} />

            </FormattingToolbar>
          )}
        />
        <SuggestionMenuController
          triggerCharacter={"/"}
          getItems={async (query) =>
            filterSuggestionItems(
              [...getDefaultReactSlashMenuItems(editor), insertAlert(editor), insertCalendar(editor), insertQuote(editor)],
              query
            )
          }
        />
      </BlockNoteView>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>show as html format</AccordionTrigger>
          <AccordionContent>
            <div>Output (HTML):</div>
            <div className="item bordered">
              <pre>
                <code>{html}</code>
              </pre>
            </div>

            <div>Output (Markdown):</div>
            <div className={"item bordered"}>
              <pre>
                <code>{markdown}</code>
              </pre>
            </div>

            <div>Document JSON:</div>
            <div className={"item bordered"}>
              <pre>
                <code>{JSON.stringify(blocks, null, 2)}</code>
              </pre>
            </div>

          </AccordionContent>
        </AccordionItem>
      </Accordion>

    </div>
  );
}