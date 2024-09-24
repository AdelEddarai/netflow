'use client'

import React from 'react';
import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface TemplateCardProps {
  title: string;
  description: string;
  content: Block[];
  color: string;
  onSelect: (content: Block[]) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ title, description, content, color, onSelect }) => {
  return (
    <Card 
        className="w-[180px] h-[120px] cursor-pointer transition-all hover:scale-105 flex flex-col justify-between"
        style={{ borderLeft: `4px solid ${color}` }}
        onClick={() => onSelect(content)}
      >
        <CardHeader className="p-3">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <CardDescription className="text-xs line-clamp-2">{description}</CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="text-xs text-muted-foreground">Click to use</div>
        </CardContent>
      </Card>
  );
};

const templates = [
  {
    title: "HR Onboarding",
    description: "New employee onboarding checklist",
    color: "#4CAF50",
    content: [
      {
        type: "heading",
        content: "New Employee Onboarding Checklist",
        props: { level: 1 }
      },
      {
        type: "bulletListItem",
        content: "Complete new hire paperwork"
      },
      {
        type: "bulletListItem",
        content: "Set up workstation and required accounts"
      },
      {
        type: "bulletListItem",
        content: "Schedule orientation and training sessions"
      },
      {
        type: "bulletListItem",
        content: "Introduce to team members and key contacts"
      },
       {
        type: "checkListItem",
        content: "Check List Item1",
      },
      {
        type: "checkListItem",
        content: "Check List Item2",
      },
      {
        type: "image",
        props: {
          url: "https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg",
          caption:
            "From https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg",
        },
      },
      {
        type: "paragraph",
        content: "Ensure all steps are completed within the first week."
      }
    ] as Block[]
  },
  {
    title: "Lesson Plan",
    description: "Weekly lesson plan template for educators",
    color: "#2196F3",
    content: [
      {
        type: "heading",
        content: [{ type: "text", text: "Weekly Lesson Plan" }],
        props: { level: 1 }
      },
      {
        type: "table",
        content: [
          {
            type: "tableRow",
            content: [
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Day" }] }] },
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Topic" }] }] },
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Activities" }] }] },
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Resources" }] }] }
            ]
          },
          {
            type: "tableRow",
            content: [
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Monday" }] }] },
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }] },
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }] },
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }] }
            ]
          },
          // Add more rows for other days of the week
        ]
      }
    ]
  },
  {
    title: "Customer Profile",
    description: "Detailed customer profile template",
    color: "#FF5733",
    content: [
      {
        type: "heading",
        content: [{ type: "text", text: "Customer Profile" }],
        props: { level: 1 }
      },
      {
        type: "heading",
        content: [{ type: "text", text: "Customer Information" }],
        props: { level: 2 }
      },
      {
        type: "table",
        content: [
          {
            type: "tableRow",
            content: [
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Name" }] }] },
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "John Doe" }] }] }
            ]
          },
          {
            type: "tableRow",
            content: [
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Company" }] }] },
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "ABC Corporation" }] }] }
            ]
          },
          {
            type: "tableRow",
            content: [
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Position" }] }] },
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "CEO" }] }] }
            ]
          }
        ]
      },
      {
        type: "heading",
        content: [{ type: "text", text: "Contact Details" }],
        props: { level: 2 }
      },
      {
        type: "table",
        content: [
          {
            type: "tableRow",
            content: [
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Email" }] }] },
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "john.doe@example.com" }] }] }
            ]
          },
          {
            type: "tableRow",
            content: [
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Phone" }] }] },
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "(123) 456-7890" }] }] }
            ]
          },
          {
            type: "tableRow",
            content: [
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Address" }] }] },
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "123 Main St, City, State" }] }] }
            ]
          }
        ]
      },
      {
        type: "heading",
        content: [{ type: "text", text: "Interaction History" }],
        props: { level: 2 }
      },
      {
        type: "table",
        content: [
          {
            type: "tableRow",
            content: [
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Date" }] }] },
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Description" }] }] }
            ]
          },
          {
            type: "tableRow",
            content: [
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "2023-01-01" }] }] },
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Initial contact made" }] }] }
            ]
          },
          {
            type: "tableRow",
            content: [
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "2023-01-15" }] }] },
              { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Follow-up call scheduled" }] }] }
            ]
          }
        ]
      },
      {
        type: "heading",
        content: [{ type: "text", text: "Notes" }],
        props: { level: 2 }
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: "Add any additional notes or comments here." }]
      },
    ]
  },
  {
    title: "Business Report",
    description: "Quarterly business report template",
    color: "#9C27B0",
    content: [
      {
        type: "heading",
        content: [{ type: "text", text: "Quarterly Business Report" }],
        props: { level: 1 }
      },
      {
        type: "heading",
        content: [{ type: "text", text: "Executive Summary" }],
        props: { level: 2 }
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: "Brief overview of the report's main points and findings." }]
      },
      {
        type: "heading",
        content: [{ type: "text", text: "Financial Performance" }],
        props: { level: 2 }
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: "Overview of key financial metrics and performance indicators." }]
      },
      {
        type: "heading",
        content: [{ type: "text", text: "Operational Highlights" }],
        props: { level: 2 }
      },
      {
        type: "bulletListItem",
        content: [{ type: "text", text: "Key operational achievement or milestone" }]
      },
      {
        type: "bulletListItem",
        content: [{ type: "text", text: "Another significant operational development" }]
      },
      {
        type: "heading",
        content: [{ type: "text", text: "Challenges and Opportunities" }],
        props: { level: 2 }
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: "Discuss current challenges and potential opportunities for growth." }]
      },
      {
        type: "heading",
        content: [{ type: "text", text: "Next Steps" }],
        props: { level: 2 }
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: "Outline the planned actions and strategies for the next quarter." }]
      }
    ]
  }
  // ... other templates remain unchanged
];

interface TemplateCardsProps<T extends BlockNoteEditor> {
  editor: T;
}

function TemplateCards<T extends BlockNoteEditor>({ editor }: TemplateCardsProps<T>) {
  const handleSelectTemplate = (content: PartialBlock[]) => {
    const currentBlock = editor.getTextCursorPosition().block;
    editor.insertBlocks(content, currentBlock, 'after');
  }

  return (
    <Card className="w-full mb-4">
      <CardHeader className="p-4">
        <CardTitle className="text-lg flex items-center">
          <PlusCircle className="mr-2 h-5 w-5" />
          Templates
        </CardTitle>
        <CardDescription>Choose a template to quickly start your document</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4">
            {templates.map((template, index) => (
              <TemplateCard
                key={index}
                title={template.title}
                description={template.description}
                content={template.content as Block[]}
                color={template.color}
                onSelect={handleSelectTemplate}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
};

export default TemplateCards;