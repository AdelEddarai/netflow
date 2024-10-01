"use client"

import React, { useState, useEffect } from 'react'
import { PlusIcon, Share2Icon, Pencil, ChevronLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { getUserBlockNotes } from '../blocknote/action'
import BlockNoteTimeline from './BlocknoteTimeLine'
import { Footer } from '@/components/home/footer/Footer'
import KanbanBoard from '@/components/kanban/KanbanUi'
import { Toaster, toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from 'framer-motion'

const SkeletonCard = () => (
  <Card className="w-full h-48">
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-3/4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-5/6 mb-2" />
      <Skeleton className="h-3 w-4/6" />
    </CardContent>
  </Card>
)

const BlockNoteCard = ({ note, onShareClick }: any) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Card className="w-full h-48 group relative overflow-hidden bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
      <Link href={`en/publish/${note.id}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg truncate">{note.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Last updated: {new Date(note.updatedAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 overflow-hidden line-clamp-3">
            {getPreviewText(note.json)}
          </p>
        </CardContent>
      </Link>
      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 bg-white dark:bg-gray-800 bg-opacity-80 backdrop-blur-sm hover:bg-opacity-100 transition-all duration-300"
          onClick={(e) => {
            e.preventDefault()
            onShareClick(note.id)
          }}
        >
          <Share2Icon className="h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors duration-300" />
        </Button>
        <Link href={`/dashboard/blocknote/${note.id}/edit`} onClick={e => e.stopPropagation()}>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 bg-white dark:bg-gray-800 bg-opacity-80 backdrop-blur-sm hover:bg-opacity-100 transition-all duration-300"
          >
            <Pencil className="h-4 w-4 text-green-500 group-hover:text-green-600 transition-colors duration-300" />
          </Button>
        </Link>
      </div>
    </Card>
  </motion.div>
)

const CreateNewBlockNoteCard = () => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Link href="/dashboard/blocknote" className="block">
      <Card className="w-full h-48 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800 dark:hover:to-purple-800 transition-colors cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-700 group">
        <PlusIcon className="h-12 w-12 text-blue-500 group-hover:text-purple-500 transition-colors duration-300" />
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 mt-2">Create New BlockNote</p>
      </Card>
    </Link>
  </motion.div>
)

export default function Component() {
  const [blockNotes, setBlockNotes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBlockNotes() {
      try {
        setIsLoading(true)
        const result = await getUserBlockNotes()
        if (result.success) {
          setBlockNotes(result.blockNotes || [])
        } else {
          setError(result.error || 'Failed to fetch BlockNotes')
        }
      } catch (err) {
        setError('An unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }
    fetchBlockNotes()
  }, [])

  const copyShareLink = (id: string) => {
    const shareLink = `${window.location.origin}/en/publish/${id}`
    navigator.clipboard.writeText(shareLink).then(() => {
      toast('Link copied to clipboard!', {
        description: 'You can now share this BlockNote with others.',
        duration: 3000,
      })
    })
  }

  return (
    <>
      <Toaster />
      <div className="container mx-auto p-4 space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Your BlockNotes</h1>
          <div className="w-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <CreateNewBlockNoteCard />

          {isLoading ? (
            Array(7).fill(0).map((_, index) => <SkeletonCard key={index} />)
          ) : error ? (
            <Card className="col-span-full p-4 bg-red-100 dark:bg-red-900">
              <CardContent>
                <p className="text-red-600 dark:text-red-300">Error: {error}</p>
              </CardContent>
            </Card>
          ) : blockNotes.length > 0 ? (
            blockNotes.map((note) => (
              <BlockNoteCard key={note.id} note={note} onShareClick={copyShareLink} />
            ))
          ) : (
            <Card className="col-span-full p-4">
              <CardContent className="flex flex-col items-center justify-center">
                <Sparkles className="h-12 w-12 text-yellow-500 mb-4" />
                <p className="text-center text-gray-600 dark:text-gray-400">No BlockNotes found. Create a new one to get started!</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        {!isLoading && blockNotes.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">BlockNotes Timeline</h2>
            <BlockNoteTimeline blockNotes={blockNotes} />
          </div>
        )}

        <div className="mt-12">
          <KanbanBoard />
        </div>
      </div>
      <Footer />
    </>	
  )
}

function getPreviewText(content: any): string {
  if (Array.isArray(content)) {
    return content.map(block => {
      if (typeof block === 'object' && block !== null) {
        if ('content' in block && Array.isArray(block.content)) {
          return block.content.join(' ')
        } else if ('content' in block && typeof block.content === 'string') {
          return block.content
        }
      }
      return ''
    }).join(' ').slice(0, 100) + '...'
  }
  return 'No preview available'
}
