"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { HomeRecentActivity } from '@/types/extended';
import { useIntersection } from '@mantine/hooks';
import { LoadingState } from '../ui/loading-state';
import { ACTIVITY_PER_PAGE } from '@/lib/constants';
import { Activity } from 'lucide-react';
import { ClientError } from '../error/ClientError';
import { useTranslations } from 'next-intl';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from 'next/link';

interface Props {
  userId: string;
  initialData: HomeRecentActivity[];
}

export const TableComponent = ({ userId, initialData }: Props) => {
  const t = useTranslations('HOME_PAGE');
  const [isAllFetched, setIsAllFetched] = useState(false);

  const lastActivityItem = useRef<null | HTMLDivElement>(null);
  const { entry, ref } = useIntersection({
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

  return (
    <div className='w-full mt-10'>
      <Table>
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
          {activityItems.map((activityItem) => (
            <TableRow key={activityItem.id}>
              <TableCell className="px-4 py-2">{activityItem.title}</TableCell>
              <TableCell className="px-4 py-2">{activityItem.emoji}</TableCell>
              <TableCell className="px-4 py-2">
                <Link href={activityItem.link} className="underline">Link</Link>
              </TableCell>
              <TableCell className="px-4 py-2">{activityItem.workspaceName}</TableCell>
              <TableCell className="px-4 py-2">
                {activityItem.updated.at ? activityItem.updated.at.toString() : ""}
              </TableCell>
              <TableCell className="px-4 py-2">{activityItem.starred ? 'Yes' : 'No'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>


      {isFetchingNextPage && (
        <div className='flex justify-center items-center mt-2'>
          <LoadingState />
        </div>
      )}
    </div>
  );
};
