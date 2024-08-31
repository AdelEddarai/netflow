'use client'

import React from 'react';
import { Block, BlockNoteEditor } from "@blocknote/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
      className="w-[200px] h-[150px] cursor-pointer transition-all hover:scale-105"
      style={{ borderTop: `4px solid ${color}` }}
      onClick={() => onSelect(content)}
    >
      <CardHeader className="p-4">
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-xs text-gray-500">Click to use template</div>
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
    ]
  },
  {
    title: "Lesson Plan",
    description: "Weekly lesson plan template for educators",
    color: "#2196F3",
    content: [
      {
        type: "heading",
        content: "Weekly Lesson Plan",
        props: { level: 1 }
      },
      {
        type: "table",
        content: [
          {
            type: "tableRow",
            content: [
              { type: "tableCell", content: [{ type: "paragraph", content: "Day" }] },
              { type: "tableCell", content: [{ type: "paragraph", content: "Topic" }] },
              { type: "tableCell", content: [{ type: "paragraph", content: "Activities" }] },
              { type: "tableCell", content: [{ type: "paragraph", content: "Resources" }] }
            ]
          },
          {
            type: "tableRow",
            content: [
              { type: "tableCell", content: [{ type: "paragraph", content: "Monday" }] },
              { type: "tableCell", content: [{ type: "paragraph", content: "" }] },
              { type: "tableCell", content: [{ type: "paragraph", content: "" }] },
              { type: "tableCell", content: [{ type: "paragraph", content: "" }] }
            ]
          },
          // ... (rows for other days of the week)
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
        content: "Customer Profile",
        props: { level: 1 }
      },
      {
        type: "heading",
        content: "Customer Information",
        props: { level: 2 }
      },
      {
        type: "table",
        content: [
          {
            type: "tableRow",
            content: [
              { type: "tableCell", content: [{ type: "paragraph", content: "Name" }] },
              { type: "tableCell", content: [{ type: "paragraph", content: "John Doe" }] }
            ]
          },
          {
            type: "tableRow",
            content: [
              { type: "tableCell", content: [{ type: "paragraph", content: "Company" }] },
              { type: "tableCell", content: [{ type: "paragraph", content: "ABC Corporation" }] }
            ]
          },
          {
            type: "tableRow",
            content: [
              { type: "tableCell", content: [{ type: "paragraph", content: "Position" }] },
              { type: "tableCell", content: [{ type: "paragraph", content: "CEO" }] }
            ]
          }
        ]
      },
      {
        type: "heading",
        content: "Contact Details",
        props: { level: 2 }
      },
      {
        type: "table",
        content: [
          {
            type: "tableRow",
            content: [
              { type: "tableCell", content: [{ type: "paragraph", content: "Email" }] },
              { type: "tableCell", content: [{ type: "paragraph", content: "john.doe@example.com" }] }
            ]
          },
          {
            type: "tableRow",
            content: [
              { type: "tableCell", content: [{ type: "paragraph", content: "Phone" }] },
              { type: "tableCell", content: [{ type: "paragraph", content: "(123) 456-7890" }] }
            ]
          },
          {
            type: "tableRow",
            content: [
              { type: "tableCell", content: [{ type: "paragraph", content: "Address" }] },
              { type: "tableCell", content: [{ type: "paragraph", content: "123 Main St, City, State" }] }
            ]
          }
        ]
      },
      {
        type: "heading",
        content: "Interaction History",
        props: { level: 2 }
      },
      {
        type: "table",
        content: [
          {
            type: "tableRow",
            content: [
              { type: "tableCell", content: [{ type: "paragraph", content: "Date" }] },
              { type: "tableCell", content: [{ type: "paragraph", content: "Description" }] }
            ]
          },
          {
            type: "tableRow",
            content: [
              { type: "tableCell", content: [{ type: "paragraph", content: "2023-01-01" }] },
              { type: "tableCell", content: [{ type: "paragraph", content: "Initial contact made" }] }
            ]
          },
          {
            type: "tableRow",
            content: [
              { type: "tableCell", content: [{ type: "paragraph", content: "2023-01-15" }] },
              { type: "tableCell", content: [{ type: "paragraph", content: "Follow-up call scheduled" }] }
            ]
          }
        ]
      },
      {
        type: "heading",
        content: "Notes",
        props: { level: 2 }
      },
      {
        type: "paragraph",
        content: "Add any additional notes or comments here."
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
        content: "Quarterly Business Report",
        props: { level: 1 }
      },
      {
        type: "heading",
        content: "Executive Summary",
        props: { level: 2 }
      },
      {
        type: "paragraph",
        content: "Brief overview of the report's main points and findings."
      },
      {
        type: "heading",
        content: "Financial Performance",
        props: { level: 2 }
      },
      {
        type: "paragraph",
        content: "Overview of key financial metrics and performance indicators."
      },
      {
        type: "heading",
        content: "Operational Highlights",
        props: { level: 2 }
      },
      {
        type: "bulletListItem",
        content: "Key operational achievement or milestone"
      },
      {
        type: "bulletListItem",
        content: "Another significant operational development"
      },
      // ... (sections for Challenges, Opportunities, Next Steps, etc.)
    ]
  }
];

interface TemplateCardsProps {
  editor: BlockNoteEditor;
}

const TemplateCards: React.FC<TemplateCardsProps> = ({ editor }) => {
  const handleSelectTemplate = (content: Block[]) => {
    const currentBlock = editor.getTextCursorPosition().block;
    editor.insertBlocks(content, currentBlock, 'after');
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {templates.map((template, index) => (
        <TemplateCard
          key={index}
          title={template.title}
          description={template.description}
          content={template.content}
          color={template.color}
          onSelect={handleSelectTemplate}
        />
      ))}
    </div>
  );
};

export default TemplateCards;