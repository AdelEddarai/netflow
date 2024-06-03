"use client"

import { useEffect, useMemo, useState, useCallback } from "react"; 
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
} from "@blocknote/react";

import { BlueButton } from "./BlueButton";

import { RiAlertFill } from "react-icons/ri";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { Alert } from "./Alert";

// Our schema with block specs, which contain the configs and implementations for blocks
// that we want our editor to use.
const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    alert: Alert,
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

// List containing all default Slash Menu Items, as well as our custom one.
const getCustomSlashMenuItems = (
  editor: BlockNoteEditor
): DefaultReactSuggestionItem[] => [
  ...getDefaultReactSlashMenuItems(editor),
  insertHelloWorldItem(editor),
];

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
              text: "blue",
              styles: { textColor: "blue", backgroundColor: "blue" },
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
      ],
      uploadFile,
    });
  }, [initialContent]);

 
  const saveContent = useCallback(async () => {
    if (editor) {
      setSaveStatus("saving");
      try {
        await saveToStorage(editor.document);
        setSaveStatus("saved");
      } catch (error) {
        setSaveStatus("error");
      }
    }
  }, [editor]);


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
      <button onClick={saveContent} className="mt-2">
        {saveStatus === "saving" ? "Saving" : saveStatus === "pending" ? "Pending" : "Saved"}
      </button>

      <SaveIndicator status={saveStatus} />

      <BlockNoteView
        editor={editor}
        slashMenu={false}
        onChange={handleChange}
      >
        <SuggestionMenuController
          triggerCharacter={"/"}
          getItems={async (query) =>
            filterSuggestionItems(
              [...getDefaultReactSlashMenuItems(editor), insertAlert(editor)],
              query
            )
          }
        />
      </BlockNoteView>
    </div>
  );
}
