"use client"

import React, { useState, useEffect } from 'react';
import { Activity, CalendarIcon, Tag, MoreHorizontal } from 'lucide-react';
import { ClientError } from '../error/ClientError';
import { useTranslations } from 'next-intl';
import { Skeleton } from '../ui/skeleton';
import { ACTIVITY_PER_PAGE } from '@/lib/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useIntersection } from '@mantine/hooks';
import { HomeRecentActivity } from '@/types/extended';
import { motion } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format, addDays } from "date-fns"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"

// Interfaces remain the same
interface Task {
    id: number;
    title: string;
    status: "inProgress" | "done";
    description: string;
    tag: string;
    dueDate?: Date;
}

// Skeleton component for loading state
const SkeletonTableCell = () => (
    <motion.div
        className="px-4 py-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
    >
        <Skeleton className="h-6 w-full rounded-md animate-pulse" />
    </motion.div>
);

// Main KanbanBoard Component
const KanbanBoard: React.FC<{ userId: string; initialData: HomeRecentActivity[] }> = ({ userId, initialData }) => {
    const t = useTranslations('HOME_PAGE');
    const [isAllFetched, setIsAllFetched] = useState(false);
    const [showSkeleton, setShowSkeleton] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([]);
    const { entry } = useIntersection({ root: null, threshold: 1 });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Fetch recent activity data (unchanged)
    const fetchRecentActivity = async ({ pageParam = 1 }: { pageParam?: number }) => {
        try {
            const res = await fetch(`/api/home_page/get?userId=${userId}&page=${pageParam}&take=${ACTIVITY_PER_PAGE}`);
            const posts = await res.json();
            return posts;
        } catch (error) {
            throw new Error('Failed to fetch recent activity');
        }
    };

    // Use infinite query to fetch data (unchanged)
    const { data, isFetchingNextPage, fetchNextPage, isError } = useInfiniteQuery(
        ['getHomeRecentActivity'],
        fetchRecentActivity,
        {
            getNextPageParam: (_, pages) => pages.length + 1,
            initialData: { pages: [initialData], pageParams: [1] },
            cacheTime: 0,
        }
    );

    // Check if all data is fetched (unchanged)
    useEffect(() => {
        if (data?.pages[data.pages.length - 1].length === 0) setIsAllFetched(true);
    }, [data?.pages]);

    // Fetch next page if intersecting and not all fetched (unchanged)
    useEffect(() => {
        if (!isAllFetched && entry?.isIntersecting) {
            fetchNextPage();
        }
    }, [entry, isAllFetched, fetchNextPage]);

    // Show loading skeleton for a limited time (unchanged)
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSkeleton(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    // Update tasks when data changes (unchanged)
    useEffect(() => {
        if (data) {
            const newTasks = data.pages
                .flatMap((page) => page)
                .map((activityItem) => ({
                    id: activityItem.id,
                    title: activityItem.title,
                    status: activityItem.status === 'done' ? 'done' : 'inProgress',
                    description: activityItem.description,
                    tag: getActivityTag(activityItem.id) || '',
                })) as Task[];
            setTasks(newTasks);
        }
    }, [data]);

    // Handle drag end to update task status
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
    
        if (active.id !== over?.id) {
            const oldIndex = tasks.findIndex((item) => item.id === active.id);
            const newIndex = tasks.findIndex((item) => item.id === over?.id);
    
            const updatedTasks = arrayMove(tasks, oldIndex, newIndex);
    
            // Update the status of the dragged item
            const draggedItem = updatedTasks[newIndex];
            if (draggedItem.status === 'inProgress' && newIndex >= updatedTasks.filter(item => item.status === 'inProgress').length) {
                draggedItem.status = 'done';
            } else if (draggedItem.status === 'done' && newIndex < updatedTasks.filter(item => item.status === 'inProgress').length) {
                draggedItem.status = 'inProgress';
            }
    
            setTasks(updatedTasks);
        }
    };
    // Save activity tag to local storage (unchanged)
    const saveActivityTag = (taskId: number, tag: string) => {
        localStorage.setItem(`task_${taskId}_tag`, tag);
    };

    // Get activity tag from local storage (unchanged)
    const getActivityTag = (taskId: number): string | null => {
        return localStorage.getItem(`task_${taskId}_tag`);
    };

    // Render loading error if fetching fails (unchanged)
    if (isError) return <ClientError message={t('ERROR')} />;

    // Render empty state if no data available (unchanged)
    if (data?.pages.every((page) => page.length === 0))
        return (
            <div className="flex flex-col gap-4 sm:gap-6 w-full mt-16 sm:mt-40 items-center">
                <div className="text-primary">
                    <Activity size={66} />
                </div>
                <p className="font-semibold text-lg sm:text-2xl max-w-3xl text-center">{t('NO_DATA')}</p>
            </div>
        );

    // Render Kanban Board
    return (
        <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-4 p-4  min-h-screen">
                <KanbanColumn status="inProgress" tasks={tasks.filter(task => task.status === 'inProgress')} showSkeleton={showSkeleton} />
                <KanbanColumn status="done" tasks={tasks.filter(task => task.status === 'done')} showSkeleton={showSkeleton} />
            </div>
        </DndContext>
    );
};

// Kanban Column Component
const KanbanColumn: React.FC<{
    status: "inProgress" | "done";
    tasks: Task[];
    showSkeleton: boolean;
}> = ({ status, tasks, showSkeleton }) => {
    return (
        <div className="w-1/2  rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 text-center">{status === 'inProgress' ? 'In Progress' : 'Done'}</h2>
            <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                {tasks.map((task) => (
                    <KanbanTask key={task.id} task={task} showSkeleton={showSkeleton} />
                ))}
            </SortableContext>
        </div>
    );
};

// Kanban Task Component
const KanbanTask: React.FC<{
    task: Task;
    showSkeleton: boolean;
}> = ({ task, showSkeleton }) => {
    const [tag, setTag] = useState(task.tag);
    const [dueDate, setDueDate] = useState<Date | undefined>(task.dueDate);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTag(event.target.value);
        // You might want to update this in your main state or backend
    };

    const handleDueDateChange = (date: Date | undefined) => {
        setDueDate(date);
        // You might want to update this in your main state or backend
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="mb-4 p-4shadow-sm hover:shadow-md transition-shadow duration-200 cursor-move"
        >
            {showSkeleton ? (
                <SkeletonTableCell />
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{task.title}</h3>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{task.description}</p>
                    <div className="flex items-center space-x-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="h-8 px-2 text-xs">
                                    <CalendarIcon className="mr-2 h-3 w-3" />
                                    {dueDate ? format(dueDate, 'MMM d') : 'Set date'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dueDate}
                                    onSelect={handleDueDateChange}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <div className="flex items-center rounded-md px-2 py-1">
                            <Tag className="h-3 w-3 mr-2" />
                            <Input
                                value={tag}
                                onChange={handleTagChange}
                                className="h-6 text-xs border-none bg-transparent"
                                placeholder="Add tag"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </Card>
    );
};

export default KanbanBoard;