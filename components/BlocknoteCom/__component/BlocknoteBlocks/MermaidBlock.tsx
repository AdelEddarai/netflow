"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import mermaid from 'mermaid';

const MermaidEditor: React.FC = () => {
  const [mermaidCode, setMermaidCode] = useState('');
  const [svg, setSvg] = useState('');
  const { resolvedTheme } = useTheme();
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: resolvedTheme === 'dark' ? 'dark' : 'default',
    });
  }, [resolvedTheme]);

  const renderDiagram = async () => {
    if (mermaidRef.current) {
      mermaidRef.current.innerHTML = mermaidCode;
      try {
        const { svg } = await mermaid.render('mermaid-diagram', mermaidCode);
        setSvg(svg);
      } catch (error) {
        console.error('Failed to render mermaid diagram:', error);
        setSvg('');
      }
    }
  };

  const handleMermaidCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMermaidCode(event.target.value);
  };

  return (
    <div className="diagram-block">
      <div className="flex flex-col items-center">
        <textarea
          className="w-full h-32 p-4 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          value={mermaidCode}
          onChange={handleMermaidCodeChange}
          placeholder="Enter Mermaid code here..."
        />
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          onClick={renderDiagram}
        >
          Render Diagram
        </button>
      </div>
      <div className="mt-8 w-full" ref={mermaidRef} dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
};

export default MermaidEditor;