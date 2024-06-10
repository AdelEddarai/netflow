"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useIntersection } from '@mantine/hooks';
import { ACTIVITY_PER_PAGE } from '@/lib/constants';
import { Activity } from 'lucide-react';
import { ClientError } from '../error/ClientError';
import { useTranslations } from 'next-intl';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import Link from 'next/link';
import { HomeRecentActivity } from '@/types/extended';
import { Skeleton } from '../ui/skeleton';

// SkeletonTableCell component definition using shadcn
const SkeletonTableCell = () => (
  <TableCell className="px-4 py-2">
    <Skeleton className="h-6 w-full bg-gray-300 rounded-md animate-pulse" />
  </TableCell>
);

interface Props {
  userId: string;
  initialData: HomeRecentActivity[];
}

export const TableComponent = ({ userId, initialData }: Props) => {
  const t = useTranslations('HOME_PAGE');
  const [isAllFetched, setIsAllFetched] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

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
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []); // Show skeleton for 5 seconds on page reload

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

  return (
    <div className='w-full mt-10 rounded-md border'>
      <Table className='rounded-md'>
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-2">Title</TableHead>
            <TableHead className="px-4 py-2">Emoji</TableHead>
            <TableHead className="px-4 py-2">Link</TableHead>
            <TableHead className="px-4 py-2">Workspace</TableHead>
            <TableHead className="px-4 py-2">Updated</TableHead>
            <TableHead className="px-4 py-2">Starred</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.pages.flatMap((page) => page).map((activityItem) => (
            <TableRow key={activityItem.id}>
              <TableCell className="px-4 py-2">{showSkeleton ? <SkeletonTableCell /> : activityItem.title}</TableCell>
              <TableCell className="px-4 py-2">{showSkeleton ? <SkeletonTableCell /> : activityItem.emoji}</TableCell>
              <TableCell className="px-4 py-2">{showSkeleton ? <SkeletonTableCell /> : <Link href={activityItem.link} className="underline">Link</Link>}</TableCell>
              <TableCell className="px-4 py-2">{showSkeleton ? <SkeletonTableCell /> : activityItem.workspaceName}</TableCell>
              <TableCell className="px-4 py-2">{showSkeleton ? <SkeletonTableCell /> : (activityItem.updated.at ? activityItem.updated.at.toString() : "")}</TableCell>
              <TableCell className="px-4 py-2">{showSkeleton ? <SkeletonTableCell /> : (activityItem.starred ? 'Yes' : 'No')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
