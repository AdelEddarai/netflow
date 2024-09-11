'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { FaDownload, FaChartBar } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { saveAs } from 'file-saver';

const BlockNoteViewClient = dynamic(
  () => import('./BlockPublish'),
  { ssr: false }
);

interface PublicBlockNotePageClientProps {
  blockNote: any;
  content: any;
}


export default function PublicBlockNotePageClient({ blockNote, content }: PublicBlockNotePageClientProps) {
  const [csvData, setCsvData] = useState<string>('');
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [markdownContent, setMarkdownContent] = useState<string>("");


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
      const headers = rows[0].split(',');
      const data = rows.slice(1).map(row => {
        const values = row.split(',');
        return headers.reduce((obj, header, index) => {
          obj[header] = isNaN(Number(values[index])) ? values[index] : Number(values[index]);
          return obj;
        }, {} as Record<string, string | number>);
      });

      setChartData(data);
      setShowChart(true);
    } else {
      alert('No table found!');
    }
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, `${blockNote.title}.md`);
  };

  return (
    <div className="min-h-screen">
      <nav className="shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">{blockNote.title}</h1>
          <div className="flex space-x-2">
          <Button
            variant={"outline"}
            onClick={handleDownloadMarkdown}
            className="ml-2"
          >
            Download Markdown
          </Button>
            <Button onClick={handleVisualize} className="flex items-center">
              <FaChartBar className="mr-2" /> Visualize
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto mt-8 p-6 rounded-lg shadow-lg">
        <BlockNoteViewClient initialContent={content} />
        
        <div className="mt-6 text-sm">
          {/* <p>Created by: User ID {username}</p> */}
          <p>Last updated: {new Date(blockNote.updatedAt).toLocaleString()}</p>
        </div>

        {showChart && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Data Visualization</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={Object.keys(chartData[0])[0]} />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(chartData[0]).slice(1).map((key, index) => (
                  <Line key={key} type="monotone" dataKey={key} stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </main>
    </div>
  );
}