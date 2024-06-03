
"use client"

import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { ClientError } from '../error/ClientError';
import { useTranslations } from 'next-intl';
import { Activity } from 'lucide-react';
import { LoadingState } from '../ui/loading-state';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, LineChart, Line, ResponsiveContainer } from 'recharts';
import { ACTIVITY_PER_PAGE } from '@/lib/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useIntersection } from '@mantine/hooks';
import { HomeRecentActivity } from '@/types/extended';

interface Props {
  userId: string;
  initialData: HomeRecentActivity[];
}

const Analytics: FC<Props> = ({ userId, initialData }) => {
  const t = useTranslations('HOME_PAGE');
  const [isAllFetched, setIsAllFetched] = useState(false);

  const lastActivityItem = useRef<null | HTMLDivElement>(null);
  const { entry } = useIntersection({
    root: lastActivityItem.current,
    threshold: 1,
  });

  const { data, isFetchingNextPage, fetchNextPage, isError } = useInfiniteQuery(
    ['getHomeRecentActivity'],
    async ({ pageParam = 1 }) => {
      const res = await fetch(
        `/api/home_page/get?userId=${userId}&page=${pageParam}&take=${ACTIVITY_PER_PAGE}`
      );
      const posts = (await res.json()) as HomeRecentActivity[];
      return posts;
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: { pages: [initialData], pageParams: [1] },
      cacheTime: 0,
    }
  );

  useEffect(() => {
    if (data?.pages[data.pages.length - 1].length === 0) setIsAllFetched(true);
  }, [data?.pages, initialData]);

  useEffect(() => {
    if (!isAllFetched && entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, isAllFetched, fetchNextPage]);

  const activityItems = useMemo(() => {
    return data?.pages.flatMap((page) => page) ?? initialData;
  }, [data?.pages, initialData]);

  if (isError) return <ClientError message={t('ERROR')} />;

  if (activityItems.length === 0)
    return (
      <div className='flex flex-col gap-4 sm:gap-6 w-full mt-16 sm:mt-40 items-center'>
        <div className='text-primary'>
          <Activity size={66} />
        </div>
        <p className='font-semibold text-lg sm:text-2xl max-w-3xl text-center'>{t('NO_DATA')}</p>
      </div>
    );

  // Count occurrences of workspace additions per day
  const workspaceCountsByDay: Record<string, number> = {};
  activityItems.forEach((activityItem) => {
    const date = new Date(activityItem.createdAt);
    const day = date.toISOString().split('T')[0]; // Extract yyyy-mm-dd
    workspaceCountsByDay[day] = (workspaceCountsByDay[day] || 0) + 1;
  });

  // Prepare data for the bar chart
  const barChartData = Object.entries(workspaceCountsByDay).map(([day, count]) => ({
    day,
    count,
  }));

  // Prepare data for the line chart
  const lineChartData = Object.entries(workspaceCountsByDay).map(([day, count]) => ({
    day,
    count,
  }));

  return (
    <div className='w-full mt-10 justify-center items-center grid grid-cols-1'>
      {/* Bar Chart */}
      <div className='mt-8'>
        <h2 className='text-2xl font-bold'>Workspace Additions Per Day</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className='mt-8'>
        <h2 className='text-2xl font-bold'>Trend of Workspace Additions</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Loading State */}
      {isFetchingNextPage && (
        <div className='flex justify-center items-center mt-2'>
          <LoadingState />
        </div>
      )}
    </div>
  );
};

export default Analytics;
