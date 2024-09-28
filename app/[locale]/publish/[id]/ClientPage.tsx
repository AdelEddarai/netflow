'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { BarChart as BarChartIcon, LineChart as LineChartIcon, Table as TableIcon, Clock, Download } from 'lucide-react'
import { Footer } from '@/components/home/footer/Footer'
import { Block } from '@blocknote/core'
import { Skeleton } from "@/components/ui/skeleton"

const BlockNoteViewClient = dynamic(
  () => import('./BlockPublish'),
  { ssr: false }
)

interface PublicBlockNotePageClientProps {
  blockNote: {
    title: string;
    updatedAt: string;
  };
  content: Block[];
}

export default function PublicBlockNotePageClient({ blockNote, content }: PublicBlockNotePageClientProps) {
  const [csvData, setCsvData] = useState<string>('')
  const [showChart, setShowChart] = useState(false)
  const [chartData, setChartData] = useState<any[]>([])
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const tableToCSV = (table: HTMLTableElement): string => {
    const rows = Array.from(table.querySelectorAll('tr'))
    return rows.map(row =>
      Array.from(row.querySelectorAll('th, td'))
        .map(cell => cell.textContent?.trim() || '')
        .join(',')
    ).join('\n')
  }

  const handleVisualize = () => {
    const table = document.querySelector('table')
    if (table) {
      const csvContent = tableToCSV(table)
      setCsvData(csvContent)

      const rows = csvContent.split('\n')
      const headers = rows[0].split(',')
      const data = rows.slice(1).map(row => {
        const values = row.split(',')
        return headers.reduce((obj, header, index) => {
          obj[header] = isNaN(Number(values[index])) ? values[index] : Number(values[index])
          return obj
        }, {} as Record<string, string | number>)
      })

      setChartData(data)
      setShowChart(true)
    }
  }

  const handleDownloadCSV = () => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'data.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="min-h-screen ">
      <header className=" shadow-sm">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {loading ? (
            <Skeleton className="h-10 w-3/4 mb-2" />
          ) : (
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">{blockNote.title}</h1>
          )}
          {loading ? (
            <Skeleton className="h-5 w-1/2" />
          ) : (
            <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="mr-1 h-4 w-4" />
              <span>Last updated: {new Date(blockNote.updatedAt).toLocaleString()}</span>
            </div>
          )}
        </div>
      </header>
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <article className="prose dark:prose-invert lg:prose-lg mx-auto">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <BlockNoteViewClient initialContent={content} />
          )}
        </article>
        
        <div className="mt-12 shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Data Visualization</h2>
            {loading ? (
              <Skeleton className="h-8 w-full mb-4" />
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={handleVisualize}>
                    <TableIcon className="mr-2 h-4 w-4" />
                    Visualize Table Data
                  </Button>
                  {showChart && (
                    <Button variant="outline" onClick={handleDownloadCSV}>
                      <Download className="mr-2 h-4 w-4" />
                      Download CSV
                    </Button>
                  )}
                </div>
                {showChart && (
                  <Tabs defaultValue="line" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="line" onClick={() => setChartType('line')}>
                        <LineChartIcon className="mr-2 h-4 w-4" />
                        Line Chart
                      </TabsTrigger>
                      <TabsTrigger value="bar" onClick={() => setChartType('bar')}>
                        <BarChartIcon className="mr-2 h-4 w-4" />
                        Bar Chart
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="line">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey={Object.keys(chartData[0])[0]} />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          {Object.keys(chartData[0]).slice(1).map((key, index) => (
                            <Line key={key} type="monotone" dataKey={key} stroke={`hsl(${index * 30}, 70%, 50%)`} />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </TabsContent>
                    <TabsContent value="bar">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey={Object.keys(chartData[0])[0]} />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          {Object.keys(chartData[0]).slice(1).map((key, index) => (
                            <Bar key={key} dataKey={key} fill={`hsl(${index * 30}, 70%, 50%)`} />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}