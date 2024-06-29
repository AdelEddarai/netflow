"use client"


import React, { useState, useEffect } from 'react';
import { Activity, CalendarIcon } from 'lucide-react';
import { ClientError } from '../error/ClientError';
import { useTranslations } from 'next-intl';
import { Skeleton } from '../ui/skeleton';
import { ACTIVITY_PER_PAGE } from '@/lib/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useIntersection } from '@mantine/hooks';
import { HomeRecentActivity } from '@/types/extended';
import { motion } from 'framer-motion';
// import './Kanban.css'


import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { addDays, format } from "date-fns"
import { Input } from '../ui/input';
import { Card } from '../ui/card';



// Define interface for Task
interface Task {
    id: number;
    title: string;
    status: "inProgress" | "done" | string; // Adjusted to remove 'toDo'
    description: string; // Add description property
    tag: string
    dueDate?: Date; // Optional due date property
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
        <Skeleton className="h-6 w-full bg-gray-900 rounded-md animate-pulse" />
    </motion.div>
);


// Kanban Board Component
const KanbanBoard: React.FC<{ userId: string; initialData: HomeRecentActivity[] }> = ({ userId, initialData }) => {
    const t = useTranslations('HOME_PAGE');
    const [isAllFetched, setIsAllFetched] = useState(false);
    const [showSkeleton, setShowSkeleton] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([]);
    const { entry } = useIntersection({ root: null, threshold: 1 });

    // Fetch recent activity data
    const fetchRecentActivity = async ({ pageParam = 1 }: { pageParam?: number }) => {
        try {
            const res = await fetch(`/api/home_page/get?userId=${userId}&page=${pageParam}&take=${ACTIVITY_PER_PAGE}`);
            const posts = await res.json();
            return posts;
        } catch (error) {
            throw new Error('Failed to fetch recent activity');
        }
    };

    // Use infinite query to fetch data
    const { data, isFetchingNextPage, fetchNextPage, isError } = useInfiniteQuery(
        ['getHomeRecentActivity'],
        fetchRecentActivity,
        {
            getNextPageParam: (_, pages) => pages.length + 1,
            initialData: { pages: [initialData], pageParams: [1] },
            cacheTime: 0,
        }
    );

    // Check if all data is fetched
    useEffect(() => {
        if (data?.pages[data.pages.length - 1].length === 0) setIsAllFetched(true);
    }, [data?.pages]);

    // Fetch next page if intersecting and not all fetched
    useEffect(() => {
        if (!isAllFetched && entry?.isIntersecting) {
            fetchNextPage();
        }
    }, [entry, isAllFetched, fetchNextPage]);

    // Show loading skeleton for a limited time
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSkeleton(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    // Update tasks when data changes
    useEffect(() => {
        if (data) {
            const newTasks = data.pages
                .flatMap((page) => page)
                .map((activityItem) => ({
                    id: activityItem.id,
                    title: activityItem.title,
                    status: activityItem.status === 'done' ? 'done' : 'inProgress', // Adjusted to remove 'toDo'
                    description: activityItem.description,
                    tag: getActivityTag(activityItem.id) || '', // Retrieve tag from local storage
                })) as Task[];
            setTasks(newTasks);
        }
    }, [data]);

    // Handle drag end to update task status
    const handleDragEnd = (event: React.DragEvent<HTMLDivElement>, task: Task) => {
        event.preventDefault();
        const updatedTasks = tasks.map((t) => {
            if (t.id === task.id) {
                return { ...t, status: t.status === 'inProgress' ? 'done' : 'inProgress' };
            }
            return t;
        });
        saveActivityTag(task.id, task.tag); // Save updated tag to local storage
        setTasks(updatedTasks);
    };

    // Save activity tag to local storage
    const saveActivityTag = (taskId: number, tag: string) => {
        localStorage.setItem(`task_${taskId}_tag`, tag);
    };

    // Get activity tag from local storage
    const getActivityTag = (taskId: number): string | null => {
        return localStorage.getItem(`task_${taskId}_tag`);
    };

    // Render loading error if fetching fails
    if (isError) return <ClientError message={t('ERROR')} />;

    // Render empty state if no data available
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
        <div className="mt-10 rounded-md">
            <div className="flex gap-4">
                {['inProgress', 'done'].map((status) => (
                    <KanbanColumn key={status} status={status} tasks={tasks} showSkeleton={showSkeleton} onDragEnd={handleDragEnd} />
                ))}
            </div>
        </div>
    );
};


// Kanban Column Component
const KanbanColumn: React.FC<{
    status: "inProgress" | "done" | string; // Adjusted to remove 'toDo'
    tasks: Task[];
    showSkeleton: boolean;
    onDragEnd: (event: React.DragEvent<HTMLDivElement>, task: Task) => void;
}> = ({ status, tasks, showSkeleton, onDragEnd }) => {
    // Maintain local state for tasks within the column
    const [columnTasks, setColumnTasks] = useState<Task[]>(tasks);

    // Filter tasks by status
    const filteredTasks = columnTasks.filter((task) => task.status === status);

    // Handle drag start event
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, task: Task) => {
        event.dataTransfer.setData('task', JSON.stringify(task));
    };

    // Handle drag over event for sorting
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>, index: number) => {
        event.preventDefault();
        const draggedTask = JSON.parse(event.dataTransfer.getData('task')) as Task;
        const newTasks = [...columnTasks];
        const currentIndex = newTasks.findIndex((task) => task.id === draggedTask.id);

        if (currentIndex !== -1) {
            newTasks.splice(currentIndex, 1);
            newTasks.splice(index, 0, draggedTask);
            setColumnTasks(newTasks);
        }
    };

    // Handle drop event (not used directly, handled in parent)
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const task = JSON.parse(event.dataTransfer.getData('task')) as Task;
        onDragEnd(event, task);
    };

    // Update tasks when props change
    useEffect(() => {
        setColumnTasks(tasks);
    }, [tasks]);

    const onUpdateTag = (taskId: number, tag: string) => {
        // Implement logic to update the tag for the specified task
        // For example:
        const updatedTasks = tasks.map((t) => {
            if (t.id === taskId) {
                return { ...t, tag };
            }
            return t;
        });
    };

    const onUpdateDueDate = (taskId: number, dueDate: Date | null) => {
        // Implement logic to update the due date for the specified task
        const updatedTasks = tasks.map((task) => {
            if (task.id === taskId) {
                return { ...task, dueDate };
            }
            return task;
        });
    };



    return (
        <div
            className="flex-1 p-4 rounded-md"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <h2 className="text-white text-center mb-4 text-lg font-semibold uppercase">{status}</h2>
            {filteredTasks.map((task, index) => (
                <KanbanTask
                    onUpdateDueDate={onUpdateDueDate}
                    onUpdateTag={onUpdateTag} // Pass the onUpdateTag function here
                    key={task.id}
                    task={task}
                    index={index} // Ensure you pass the index prop here
                    showSkeleton={showSkeleton}
                    onDragStart={handleDragStart}
                    onDragOver={(e) => handleDragOver(e, index)}
                />

            ))}
        </div>
    );
};

// Kanban Task Component
const KanbanTask: React.FC<{
    task: Task;
    index: number;
    showSkeleton: boolean;
    onDragStart: (event: React.DragEvent<HTMLDivElement>, task: Task) => void;
    onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
    onUpdateTag: (taskId: number, tag: string) => void; // Function to update tag
    onUpdateDueDate: (taskId: number, dueDate: Date | null) => void; // Function to update due date
}> = ({ task, index, showSkeleton, onDragStart, onDragOver, onUpdateTag, onUpdateDueDate }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [tag, setTag] = useState(task.tag);
    const [dueDate, setDueDate] = useState<Date | null>(task.dueDate || null); // Initialize with existing due date if any
    const [date, setDate] = React.useState<Date>()


    useEffect(() => {
        const taskElement = document.getElementById(`task-${task.id}`);
        if (taskElement) {
            taskElement.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
        }
    }, [task.id]);

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        setIsDragging(true);
        onDragStart(event, task);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        onDragOver(event);
    };

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        const taskElement = event.currentTarget;
        const dragStartEvent = new DragEvent('dragstart', {
            bubbles: true,
            cancelable: true,
            dataTransfer: new DataTransfer(),
        });
        Object.defineProperty(dragStartEvent, 'dataTransfer', { value: new DataTransfer() });
        dragStartEvent.dataTransfer!.setData('task', JSON.stringify(task));
        taskElement.dispatchEvent(dragStartEvent);
    };

    const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
        setIsDragging(false);
        const taskElement = event.currentTarget;
        const dropEvent = new DragEvent('drop', {
            bubbles: true,
            cancelable: true,
            dataTransfer: new DataTransfer(),
        });
        Object.defineProperty(dropEvent, 'dataTransfer', { value: new DataTransfer() });
        dropEvent.dataTransfer!.setData('task', JSON.stringify(task));
        taskElement.dispatchEvent(dropEvent);
    };

    const handleUpdateTag = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTag = event.target.value;
        setTag(newTag);
        onUpdateTag(task.id, newTag); // Call parent function to update tag
    };

    const handleDueDateChange = (date: Date | null) => {
        setDueDate(date);
        onUpdateDueDate(task.id, date); // Call parent function to update due date
    };

    return (
        <Card 
            id={`task-${task.id}`}
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`bg-black border border-gray-900 p-3 mb-2 rounded-md shadow-md cursor-pointer ${showSkeleton ? 'opacity-50' : 'opacity-100'
                } ${isDragging ? 'dragging' : ''}`}  // Added responsive width classes here
            style={{ transform: isDragging ? 'translate(5px, -5px)' : 'translate(0, 0)' }}
        >
            {showSkeleton ? (
                <SkeletonTableCell />
            ) : (
                <motion.div
                    className="content"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ opacity: 1 }}
                    whileTap={{ opacity: 0.7 }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-green-300">{task.title}</h3>
                        {/* <Input
                            type="text"
                            value={tag}
                            onChange={handleUpdateTag}
                            className="border-b border-gray-300 focus:border-blue-500 outline-none px-1 text-sm w-32"
                            placeholder="Add tag"
                        /> */}
                    </div>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-2 space-y-2 sm:space-y-0 sm:space-x-2">
                        <Input
                            type="text"
                            value={tag}
                            onChange={handleUpdateTag}
                            className="border-b border-gray-300 focus:border-blue-500 outline-none px-1 text-sm w-1/2 sm:w-1/3"
                            placeholder="Add tag"
                        />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full sm:w-[280px] justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                                <Select
                                    onValueChange={(value) => handleDueDateChange(addDays(new Date(), parseInt(value)))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="0">Today</SelectItem>
                                        <SelectItem value="1">Tomorrow</SelectItem>
                                        <SelectItem value="3">In 3 days</SelectItem>
                                        <SelectItem value="7">In a week</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="rounded-md border">
                                    <Calendar mode="single" selected={date} onSelect={setDate} />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </motion.div>
            )}
        </Card>

    );
};
export default KanbanBoard;