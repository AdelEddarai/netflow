'use client'

import { PlusIcon, PencilIcon, Share2Icon } from 'lucide-react';
import Link from 'next/link';
import { getUserBlockNotes } from '../blocknote/action';
import { useState, useEffect } from 'react';
import BlockNoteTimeline from './BlocknoteTimeLine';
import { CiCircleChevLeft } from "react-icons/ci";
import { Footer } from '@/components/home/footer/Footer';


export default function DashboardPage() {
  const [blockNotes, setBlockNotes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlockNotes() {
      const result = await getUserBlockNotes();
      if (result.success) {
        setBlockNotes(result.blockNotes || []);
      } else {
        setError(result.error || 'Failed to fetch BlockNotes');
      }
    }
    fetchBlockNotes();
  }, []);

  const copyShareLink = (id: string) => {
    const shareLink = `${window.location.origin}/publish/${id}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      alert('is done')
    });
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="container mx-auto p-4">
        <Link href={"/dashboard"}>
          <CiCircleChevLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold mb-6">Your BlockNotes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* New BlockNote Card */}
          <Link href="/dashboard/blocknote" className="block">
            <div className="border rounded-lg p-4 h-40 flex items-center justify-center hover:bg-gray-700 transition-colors">
              <PlusIcon className="h-12 w-12 text-gray-400" />
            </div>
          </Link>

          {/* Existing BlockNotes */}
          {blockNotes.length > 0 ? (
            blockNotes.map((note) => (
              <div key={note.id} className="relative group">
                <Link href={`/dashboard/blocknote/${note.id}`} className="block">
                  <div className="border rounded-lg p-4 h-40 hover:shadow-md transition-shadow">
                    <h2 className="font-semibold mb-2 truncate">{note.title}</h2>
                    <p className="text-sm text-gray-500 mb-2">
                      Last updated: {new Date(note.updatedAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-700 overflow-hidden line-clamp-3">
                      {getPreviewText(note.json)}
                    </p>
                  </div>
                </Link>
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      copyShareLink(note.id);
                    }}
                    className="bg-green-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Share2Icon className="h-4 w-4" />
                  </button>
                  <Link 
                    href={`/dashboard/blocknote/${note.id}/edit`} 
                    className="bg-blue-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No BlockNotes found. Create a new one to get started!</p>
          )}
        </div>
        
        {blockNotes.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">BlockNotes Timeline</h2>
            <BlockNoteTimeline blockNotes={blockNotes} />
          </div>
        )}
      </div>
      <Footer />
      
    </>	
  );
}

function getPreviewText(content: any): string {
  if (Array.isArray(content)) {
    return content.map(block => {
      if (typeof block === 'object' && block !== null) {
        if ('content' in block && Array.isArray(block.content)) {
          return block.content.join(' ');
        } else if ('content' in block && typeof block.content === 'string') {
          return block.content;
        }
      }
      return '';
    }).join(' ').slice(0, 100) + '...';
  }
  return 'No preview available';
}