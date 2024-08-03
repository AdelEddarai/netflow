"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useIntersection } from '@mantine/hooks';
import { ACTIVITY_PER_PAGE } from '@/lib/constants';
import { Activity } from 'lucide-react';
import { ClientError } from '../error/ClientError';
import { useTranslations } from 'next-intl';
import { HomeRecentActivity } from '@/types/extended';
import { format, parseISO, eachWeekOfInterval, eachDayOfInterval, subYears, addDays } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  userId: string;
  initialData: HomeRecentActivity[];
}

export const CommitGraph = ({ userId, initialData }: Props) => {
  const t = useTranslations('HOME_PAGE');
  const [isAllFetched, setIsAllFetched] = useState(false);
  const [activityData, setActivityData] = useState<Record<string, number>>({});

  const lastActivityItem = useRef<null | HTMLDivElement>(null);
  const { entry, ref } = useIntersection({
    root: lastActivityItem.current,
    threshold: 1,
  });

  const fetchRecentActivity = useCallback(async ({ pageParam = 1 }) => {
    try {
      const res = await fetch(`/api/home_page/get?userId=${userId}&page=${pageParam}&take=${ACTIVITY_PER_PAGE}`);
      const posts = await res.json();
      return posts;
    } catch (error) {
      throw new Error('Failed to fetch recent activity');
    }
  }, [userId]);

  const { data, isFetchingNextPage, fetchNextPage, isError } = useInfiniteQuery(
    ['getHomeRecentActivity'],
    fetchRecentActivity,
    {
      getNextPageParam: (_, pages) => pages.length + 1,
      initialData: { pages: [initialData], pageParams: [1] },
      cacheTime: 0,
    }
  );

  useEffect(() => {
    if (data?.pages[data.pages.length - 1].length === 0) setIsAllFetched(true);
  }, [data?.pages]);

  useEffect(() => {
    if (!isAllFetched && entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, isAllFetched, fetchNextPage]);

  useEffect(() => {
    if (data) {
      const newActivityData: Record<string, number> = {};
      data.pages.flat().forEach(item => {
        const month = format(parseISO(item.updated.at), 'yyyy-MM');
        newActivityData[month] = (newActivityData[month] || 0) + 1;
      });
      setActivityData(newActivityData);
    }
  }, [data]);

  if (isError) return <ClientError message={t('ERROR')} />;

  if (data?.pages.every(page => page.length === 0))
    return (
      <div className='flex flex-col gap-4 sm:gap-6 w-full mt-16 sm:mt-40 items-center'>
        <div className='text-primary'>
          <Activity size={66} />
        </div>
        <p className='font-semibold text-lg sm:text-2xl max-w-3xl text-center'>{t('NO_DATA')}</p>
      </div>
    );

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-100';
    if (count < 5) return 'bg-green-200';
    if (count < 10) return 'bg-green-400';
    if (count < 15) return 'bg-green-600';
    return 'bg-green-800';
  };

  const today = new Date();
  const oneYearAgo = subYears(today, 1);
  const weeks = eachWeekOfInterval({ start: oneYearAgo, end: today });

  return (
    <div className='w-full mt-10 p-4 rounded-md border'>
      <h2 className="text-2xl font-bold mb-4">Activity Contribution Graph</h2>
      <TooltipProvider>
        <div className="flex">
          {weeks.map((week) => {
            const days = eachDayOfInterval({ start: week, end: addDays(week, 6) });
            return (
              <div key={week.toISOString()} className="flex flex-col gap-1">
                {days.map((day) => {
                  const formattedDate = format(day, 'yyyy-MM-dd');
                  const month = format(day, 'yyyy-MM');
                  const count = activityData[month] || 0;
                  return (
                    <Tooltip key={formattedDate}>
                      <TooltipTrigger>
                        <div
                          className={`w-3 h-3 ${getColor(count)} rounded-sm cursor-pointer`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{format(day, 'MMMM d, yyyy')}</p>
                        <p>{count} tasks</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            );
          })}
        </div>
      </TooltipProvider>
      <div className="mt-2 flex items-center justify-end">
        <span className="text-sm mr-2">Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-gray-100 rounded-sm" />
          <div className="w-3 h-3 bg-green-200 rounded-sm" />
          <div className="w-3 h-3 bg-green-400 rounded-sm" />
          <div className="w-3 h-3 bg-green-600 rounded-sm" />
          <div className="w-3 h-3 bg-green-800 rounded-sm" />
        </div>
        <span className="text-sm ml-2">More</span>
      </div>
      {!isAllFetched && <div ref={ref} />}
    </div>
  );
};