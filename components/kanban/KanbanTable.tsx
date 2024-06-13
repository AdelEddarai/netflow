"use client"

import React, { useEffect, useState, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useIntersection } from '@mantine/hooks';
import { ACTIVITY_PER_PAGE } from '@/lib/constants';
import { ClientError } from '../error/ClientError';
import { useTranslations } from 'next-intl';
import { Skeleton } from '../ui/skeleton';
import { HomeRecentActivity } from '@/types/extended';
import { DndContext, closestCenter, useDraggable } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Define Task interface
interface Task {
  id: number;
  title: string;
  status: 'todo' | 'inProgress' | 'done';
}

// Skeleton component for loading state
const SkeletonTableCell = () => (
  <div className="px-4 py-2">
    <Skeleton className="h-6 w-full bg-gray-900 rounded-md animate-pulse" />
  </div>
);

// Kanban board component
const KanbanBoard: React.FC<{ userId: string; initialData: HomeRecentActivity[] }> = ({ userId, initialData }) => {
  const t = useTranslations('HOME_PAGE');
  const [isAllFetched, setIsAllFetched] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Intersection observer for fetching more data
  const { entry } = useIntersection({
    root: null,
    threshold: 1,
  });

  // Fetch recent activity function
  const fetchRecentActivity = useCallback(async ({ pageParam = 1 }) => {
    try {
      const res = await fetch(`/api/home_page/get?userId=${userId}&page=${pageParam}&take=${ACTIVITY_PER_PAGE}`);
      const posts = await res.json();
      return posts;
    } catch (error) {
      throw new Error('Failed to fetch recent activity');
    }
  }, [userId]);

  // UseInfiniteQuery hook to fetch data
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

  // Fetch next page when intersection is detected
  useEffect(() => {
    if (!isAllFetched && entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, isAllFetched, fetchNextPage]);

  // Timer to hide skeleton loading after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Update tasks when data changes
  useEffect(() => {
    if (data) {
      const newTasks = data.pages.flatMap((page) => page).map((activityItem) => ({
        id: activityItem.id,
        title: activityItem.title,
        status: activityItem.status === 'done' ? 'done' : activityItem.status === 'inProgress' ? 'inProgress' : 'todo',
      })) as Task[];
      setTasks(newTasks);
    }
  }, [data]);

  // Handle drag and drop end event
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return; // No drop target, do nothing

    const activeTask = tasks.find(task => task.id === active.id);
    if (!activeTask) return; // Active task not found, do nothing

    // Determine the new status based on the drop target (over.id)
    let newStatus: 'todo' | 'inProgress' | 'done' = 'todo'; // Default to todo

    if (over.id === 'inProgressColumn') {
      newStatus = 'inProgress';
    } else if (over.id === 'doneColumn') {
      newStatus = 'done';
    }

    // Update the tasks state based on the new status
    setTasks(tasks => {
      const updatedTasks = [...tasks];
      const taskIndex = updatedTasks.findIndex(task => task.id === active.id);

      if (taskIndex !== -1) {
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          status: newStatus,
        };
      }

      return updatedTasks;
    });
  };

  // Render error if there's an error
  if (isError) return <ClientError message={t('ERROR')} />;

  // Render message if no data
  if (data?.pages.every(page => page.length === 0))
    return (
      <div className='flex flex-col gap-4 sm:gap-6 w-full mt-16 sm:mt-40 items-center'>
        <div className='text-primary'>
        </div>
        <p className='font-semibold text-lg sm:text-2xl max-w-3xl text-center'>{t('NO_DATA')}</p>
      </div>
    );

  // Statuses for Kanban columns
  const statuses: ('todo' | 'inProgress' | 'done')[] = ['todo', 'inProgress', 'done'];

  // Main return of the Kanban board
  return (
    <div className='w-full mt-10 rounded-md'>
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <div className="flex space-x-4">
          {statuses.map(status => (
            <div key={status} className="flex-1 p-4">
              <h2 className="text-lg font-bold mb-4">{status.charAt(0).toUpperCase() + status.slice(1)}</h2>
              <SortableContext items={tasks.filter(task => task.status === status)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {tasks.filter(task => task.status === status).map((task, index) => (
                    <KanbanCard key={task.id} task={task} index={index} showSkeleton={showSkeleton} />
                  ))}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
};

// Kanban card component
const KanbanCard: React.FC<{ task: Task; index: number; showSkeleton: boolean }> = ({ task, index, showSkeleton }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 'auto', // Ensure dragged item is above other items
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-black p-4 shadow-md rounded-md cursor-pointer ${isDragging ? 'ring-2 ring-blue-500' : ''}`}
    >
      {showSkeleton ? <SkeletonTableCell /> : task.title}
    </div>
  );
};

export default KanbanBoard;
