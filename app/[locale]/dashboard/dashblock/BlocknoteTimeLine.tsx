"use client"

import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

interface BlockNote {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface BlockNoteTimelineProps {
  blockNotes: BlockNote[];
}

const BlockNoteTimelineCalendar: React.FC<BlockNoteTimelineProps> = ({ blockNotes }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const eventMap = blockNotes.reduce((acc: Record<string, Array<{ type: 'created' | 'updated', note: BlockNote }>>, note) => {
    const createdDate = format(new Date(note.createdAt), 'yyyy-MM-dd');
    const updatedDate = format(new Date(note.updatedAt), 'yyyy-MM-dd');
    
    if (!acc[createdDate]) acc[createdDate] = [];
    if (!acc[updatedDate]) acc[updatedDate] = [];
    
    acc[createdDate].push({ type: 'created', note });
    if (createdDate !== updatedDate) {
      acc[updatedDate].push({ type: 'updated', note });
    }
    
    return acc;
  }, {});

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const renderDay = (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const events = eventMap[dateKey];

    if (!events) return null;

    return (
      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
        <div className="w-10 h-4 rounded-full" style={{
          backgroundColor: events.some(e => e.type === 'created') && events.some(e => e.type === 'updated')
            ? 'purple'
            : events.some(e => e.type === 'created')
              ? 'green'
              : 'blue'
        }}></div>
      </div>
    );
  };

  const renderPopoverContent = (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const events = eventMap[dateKey];

    if (!events) return null;

    return (
      <div className="p-2 max-w-sm">
        <h3 className="font-semibold mb-2">{format(day, 'MMMM d, yyyy')}</h3>
        {events.map((event, index) => (
          <div key={index} className="mb-2">
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
              event.type === 'created' ? 'bg-green-500' : 'bg-blue-500'
            }`}></span>
            <span className="text-sm">
              {event.type === 'created' ? 'Created: ' : 'Updated: '}
              {event.note.title}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full dark:bg-black">
      <CardHeader>
        <CardTitle>BlockNote Timeline Calendar</CardTitle>
        <CardDescription>{format(currentMonth, 'MMMM yyyy')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold">{day}</div>
          ))}
          {daysInMonth.map((day, index) => (
            <Popover key={day.toString()}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-24 w-full p-0 font-normal relative"
                >
                  <time dateTime={format(day, 'yyyy-MM-dd')}>
                    {format(day, 'd')}
                  </time>
                  {renderDay(day)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                {renderPopoverContent(day)}
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center space-x-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm">Created</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-sm">Updated</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
          <span className="text-sm">Created & Updated</span>
        </div>
      </CardFooter>
    </Card>
  );
};

const BlockNoteChart: React.FC<BlockNoteTimelineProps> = ({ blockNotes }) => {
    // Sort notes by updatedAt date, most recent first
    const sortedNotes = [...blockNotes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  
    const chartData = sortedNotes.map(note => ({
      title: note.title.length > 20 ? note.title.substring(0, 17) + '...' : note.title,
      daysSinceCreation: Math.floor((new Date().getTime() - new Date(note.createdAt).getTime()) / (1000 * 3600 * 24)),
      daysSinceUpdate: Math.floor((new Date().getTime() - new Date(note.updatedAt).getTime()) / (1000 * 3600 * 24)),
    }));
  
    const chartConfig = {
      daysSinceCreation: {
        label: "Days Since Creation",
        color: "hsl(var(--chart-1))",
      },
      daysSinceUpdate: {
        label: "Days Since Last Update",
        color: "hsl(var(--chart-2))",
      },
    } satisfies ChartConfig;
  
    const mostRecentNote = sortedNotes[0];
  
    return (
      <Card className='dark:bg-black'>
        <CardHeader>
          <CardTitle>BlockNote Activity</CardTitle>
          <CardDescription>Days since creation and last update for each note</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData} layout="vertical">
              <CartesianGrid horizontal={false} />
              <XAxis type="number" />
              <YAxis
                dataKey="title"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="daysSinceCreation" fill="var(--color-daysSinceCreation)" radius={4} />
              <Bar dataKey="daysSinceUpdate" fill="var(--color-daysSinceUpdate)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Trending: {mostRecentNote.title} (Last updated: {new Date(mostRecentNote.updatedAt).toLocaleDateString()})
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing days since creation and last update for all notes
          </div>
        </CardFooter>
      </Card>
    );
  };

const BlockNoteTimeline: React.FC<BlockNoteTimelineProps> = ({ blockNotes }) => {
  return (
    <div className="space-y-2">
      <BlockNoteTimelineCalendar blockNotes={blockNotes} />
      <BlockNoteChart blockNotes={blockNotes} />
    </div>
  );
};

export default BlockNoteTimeline;