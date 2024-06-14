"use client"


import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { ClientError } from '../error/ClientError';
import { useTranslations } from 'next-intl';
import { Skeleton } from '../ui/skeleton';
import { ACTIVITY_PER_PAGE } from '@/lib/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useIntersection } from '@mantine/hooks';
import { HomeRecentActivity } from '@/types/extended';


// Define interface for Task
interface Task {
    id: number;
    title: string;
    status: "inProgress" | "done" | string; // Ensure status type matches this definition
    description: string; // Add description property
}

// Skeleton component for loading state
const SkeletonTableCell = () => (
    <div className="px-4 py-2">
        <Skeleton className="h-6 w-full bg-gray-900 rounded-md animate-pulse" />
    </div>
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
                    status: activityItem.status === 'done' ? 'done' : 'inProgress',
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
        setTasks(updatedTasks);
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
        <div className="w-full mt-10 rounded-md">
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
    status: "inProgress" | "done" | string; // Ensure status type matches this definition
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

    return (
        <div
            className="flex-1 p-4 rounded-md"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <h2 className="text-black text-center mb-4 text-lg font-semibold uppercase">{status}</h2>
            {filteredTasks.map((task, index) => (
                <KanbanTask
                    key={task.id}
                    task={task}
                    index={index}
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
}> = ({ task, index, showSkeleton, onDragStart, onDragOver }) => {
    useEffect(() => {
        const taskElement = document.getElementById(`task-${task.id}`);
        if (taskElement) {
            taskElement.style.transition = 'background-color 0.2s ease, transform 0.2s ease';
        }
    }, [task.id]);

    // Handle drag start event
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        onDragStart(event, task);
    };

    // Handle drag over event for sorting
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        onDragOver(event);
    };

    return (
        <div
            id={`task-${task.id}`}
            draggable
            onDragStart={handleDragStart}
            onDragOver={onDragOver}
            className={`bg-black border  p-3 mb-2 rounded-md shadow-md cursor-pointer z-10 transition-opacity ${showSkeleton ? 'opacity-50' : 'opacity-100'
                }`}
            style={{ cursor: 'move' }}
        >
            {showSkeleton ? (
                <SkeletonTableCell />
            ) : (
                <>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{task.title}</h3>
                        <div
                            className={`px-2 py-1 rounded-md text-xs font-bold ${task.status === 'done' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-gray-800'
                                }`}
                        >
                            {task.status === 'done' ? 'Done' : 'In Progress'}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">{task.description}</p> {/* Display description */}
                </>
            )}
        </div>
    );
};



export default KanbanBoard;
