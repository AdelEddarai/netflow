// Main App

"use client"

import {
  BlockNoteSchema,
  defaultBlockSpecs,
  filterSuggestionItems,
  insertOrUpdateBlock,
  Block,
  BlockNoteEditor, 
  PartialBlock,
} from "@blocknote/core";

import "@blocknote/core/fonts/inter.css";
import {
  FormattingToolbar,
  FormattingToolbarController,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
 
import { RiAlertFill } from "react-icons/ri";
import { RiFilePdfFill } from "react-icons/ri";

import { useEffect, useMemo, useState } from "react";
// mermaid plugin
// import { MermaidBlock } from "@defensestation/blocknote-mermaid";
// import { insertMermaid } from "@defensestation/blocknote-mermaid";


// comments plugin
import {
  commentStyleSpec,
  CommentToolbarController,
  CreateCommentButton,
} from "@defensestation/blocknote-comments";

// code plugin
import { CodeBlock, insertCode } from "@defensestation/blocknote-code";


// component imports
import { Alert } from "./Alert";
import { PDF } from "./PdfBlock";


// Local Storage Implementation function
async function saveToStorage(jsonBlocks: Block[]) {
  // Save contents to local storage. You might want to debounce this or replace
  // with a call to your API / database.
  localStorage.setItem("editorContent", JSON.stringify(jsonBlocks));
}
 
async function loadFromStorage() {
  // Gets the previously stored editor contents.
  const storageString = localStorage.getItem("editorContent");
  return storageString
    ? (JSON.parse(storageString) as PartialBlock[])
    : undefined;
}

 
// Our schema with block specs, which contain the configs and implementations for blocks
// that we want our editor to use.
const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    // mermaid: MermaidBlock,
    // comment: commentStyleSpec,
    // procode: CodeBlock,
    // Adds the Alert block.
    alert: Alert,
    pdf: PDF,
    
  },
});


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
  icon: <RiFilePdfFill />,
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
    "adel",
  ],
  group: "Other",
  icon: <RiAlertFill />,
});


// comment 
const CustomToolbar = () => (<FormattingToolbarController
  formattingToolbar={() => (
    <FormattingToolbar>
      <CreateCommentButton key={"createCommentButtin"} />
    </FormattingToolbar>
  )}
/>)
 

// Uploads a file to tmpfiles.org and returns the URL to the uploaded file.
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

export default function Editor() {

  const [initialContent, setInitialContent] = useState<
  PartialBlock[] | undefined | "loading"
>("loading");

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
  return BlockNoteEditor.create({ initialContent, schema, uploadFile });
}, [initialContent]);

if (editor === undefined) {
  return "Loading content...";
}

  // Creates a new editor instance.
  // const editor = useCreateBlockNote({
  //   schema,
  //   initialContent: [
  //     {
  //       type: "paragraph",
  //       content: "Welcome to this demo!",
  //     },
  //     {
  //       type: "alert",
  //       content: "This is an example alert",
  //     },
  //     {
  //       type: "paragraph",
  //       content: "Press the '/' key to open the Slash Menu and add another",
  //     },
  //     {
  //       type: "paragraph",
  //     },
  //     {
  //       type: "image",
  //     },
  //     {
  //       type: "pdf",
  //       // props: {
  //       //   url: "https://pdfobject.com/pdf/sample.pdf",
  //       // },
  //     },
  //   ],
  //   uploadFile,
  // });


    
 
  // Renders the editor instance.
  return (
    <BlockNoteView editor={editor} slashMenu={false}>
      <CustomToolbar />
      <CommentToolbarController />
      {/* Replaces the default Slash Menu. */}
      <SuggestionMenuController
        triggerCharacter={"/"}
        getItems={async (query) =>
          // Gets all default slash menu items and `insertAlert` item.
          filterSuggestionItems(
            [...getDefaultReactSlashMenuItems(editor), insertAlert(editor), insertPDF(editor)],
            query
          )
        }
      />
    </BlockNoteView>
  );
}
 