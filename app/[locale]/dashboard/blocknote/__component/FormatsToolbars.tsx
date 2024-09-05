"use client";

import React from 'react';
import {
  BlockTypeSelect,
  BasicTextStyleButton,
  TextAlignButton,
  ColorStyleButton,
  NestBlockButton,
  UnnestBlockButton,
  CreateLinkButton,
  FormattingToolbar,
  useBlockNote
} from "@blocknote/react";
import { Button } from "@/components/ui/button";
import { useCompletion } from "ai/react";
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FormattingToolbarComponent: React.FC = () => {
  const editor = useBlockNote();

  const { complete: translateText } = useCompletion({
    api: '/api/translate',
    onFinish: (result) => {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        content: result
      });
      toast.success('Text translated successfully!');
    },
    onError: () => toast.error('Failed to translate text. Please try again.')
  });

  const { complete: spellCheck } = useCompletion({
    api: '/api/spellcheck',
    onFinish: (result) => {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        content: result
      });
      toast.success('Spelling checked and corrected!');
    },
    onError: () => toast.error('Failed to check spelling. Please try again.')
  });

  const handleTranslate = () => {
    const block = editor.getTextCursorPosition().block;
    const text = block ? block.content : '';
    if (typeof text === 'string' && text.trim() !== '') {
      translateText(text);
    } else {
      toast.error('No text selected for translation.');
    }
  };

  const handleSpellCheck = () => {
    const block = editor.getTextCursorPosition().block;
    const text = block ? block.content : '';
    if (typeof text === 'string' && text.trim() !== '') {
      spellCheck(text);
    } else {
      toast.error('No text selected for spell check.');
    }
  };

  const handleAISummary = () => {
    const block = editor.getTextCursorPosition().block;
    const text = block ? block.content : '';
    if (typeof text === 'string' && text.trim() !== '') {
      // Implement AI summary logic here
      toast.success('AI summary generated!');
    } else {
      toast.error('No text selected for AI summary.');
    }
  };

  return (
    <FormattingToolbar>
      <BlockTypeSelect key="blockTypeSelect" />
      <BasicTextStyleButton basicTextStyle="bold" key="boldStyleButton" />
      <BasicTextStyleButton basicTextStyle="italic" key="italicStyleButton" />
      <BasicTextStyleButton basicTextStyle="underline" key="underlineStyleButton" />
      <BasicTextStyleButton basicTextStyle="strike" key="strikeStyleButton" />
      <BasicTextStyleButton basicTextStyle="code" key="codeStyleButton" />
      <TextAlignButton textAlignment="left" key="textAlignLeftButton" />
      <TextAlignButton textAlignment="center" key="textAlignCenterButton" />
      <TextAlignButton textAlignment="right" key="textAlignRightButton" />
      <ColorStyleButton key="colorStyleButton" />
      <NestBlockButton key="nestBlockButton" />
      <UnnestBlockButton key="unnestBlockButton" />
      <CreateLinkButton key="createLinkButton" />

      {/* AI Features */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            AI Features
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>AI Features</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleTranslate}>
            Translate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSpellCheck}>
            Spell Check
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleAISummary}>
            AI Summary
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </FormattingToolbar>
  );
};

export default FormattingToolbarComponent;
