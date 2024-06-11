"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useIntersection } from '@mantine/hooks';
import { ACTIVITY_PER_PAGE } from '@/lib/constants';
import { Activity } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { HomeRecentActivity } from '@/types/extended';
import { List, arrayMove } from 'react-movable';
import { Skeleton } from '@/components/ui/skeleton';
import { ClientError } from '@/components/error/ClientError';

// SkeletonTableCell component definition
const SkeletonTableCell = () => (
  <td className="px-4 py-2">
    <Skeleton className="h-6 w-full bg-gray-300 rounded-md animate-pulse" />
  </td>
);

const tableStyles = {
  background: '#eaebec',
  borderSpacing: 0,
};

const thStyles = {
  borderBottom: '2px solid #ddd',
  padding: '30px',
  background: '#ededed',
  color: '#666',
  textAlign: 'center',
  fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
} as React.CSSProperties;

const tdStyles = (width?: string): React.CSSProperties => ({
  borderBottom: '1px solid #ddd',
  color: '#666',
  fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
  padding: '24px',
  textAlign: 'center',
  width,
});

interface Props {
  userId: string;
  initialData: HomeRecentActivity[];
}

export const TableList = ({ userId, initialData }: Props) => {
  const t = useTranslations('HOME_PAGE');
  const [isAllFetched, setIsAllFetched] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [items, setItems] = useState<HomeRecentActivity[]>(initialData);
  const [widths, setWidths] = useState<string[]>([]);

  const lastActivityItem = useRef<null | HTMLDivElement>(null);
  const { entry, ref } = useIntersection({
    root: lastActivityItem.current,
    threshold: 1,
  });

  const fetchRecentActivity = useCallback(
    async ({ pageParam = 1 }) => {
      try {
        const res = await fetch(
          `/api/home_page/get?userId=${userId}&page=${pageParam}&take=${ACTIVITY_PER_PAGE}`
        );
        const posts = await res.json();
        return posts;
      } catch (error) {
        throw new Error('Failed to fetch recent activity');
      }
    },
    [userId]
  );

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
    if (data) {
      const flattenedData = data.pages.flatMap((page) => page);
      setItems(flattenedData);
    }
  }, [data]);

  return (
    <div className="w-full mt-10 rounded-md border">
      <div
        style={{
          padding: '3em',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <List
          beforeDrag={({ elements, index }) => {
            // const cells = Array.from(elements[index]?.children || []);
            // const widths = cells.map((cell) => window.getComputedStyle(cell).width);
            setWidths(widths);
          }}
          
          values={items}
          onChange={({ oldIndex, newIndex }) =>
            setItems(arrayMove(items, oldIndex, newIndex))
          }
          renderList={({ children, props, isDragged }) => (
            <table
              style={{
                ...tableStyles,
                cursor: isDragged ? 'grabbing' : undefined,
              }}
            >
              <thead>
                <tr>
                  <th style={thStyles}>Title</th>
                  <th style={thStyles}>Emoji</th>
                  <th style={thStyles}>Link</th>
                  <th style={thStyles}>Workspace</th>
                  <th style={thStyles}>Updated</th>
                  <th style={thStyles}>Starred</th>
                </tr>
              </thead>
              <tbody {...props}>{children}</tbody>
            </table>
          )}
          renderItem={({ value, props, isDragged, isSelected }) => {
            const _widths = isDragged ? widths : [];
            const row = (
              <tr
                {...props}
                style={{
                  ...props.style,
                  cursor: isDragged ? 'grabbing' : 'grab',
                  backgroundColor: isDragged || isSelected ? '#EEE' : '#fafafa',
                }}
              >
                <td style={tdStyles(_widths[0])}>
                  {showSkeleton ? <SkeletonTableCell /> : value.title}
                </td>
                <td style={tdStyles(_widths[1])}>
                  {showSkeleton ? <SkeletonTableCell /> : value.emoji}
                </td>
                <td style={tdStyles(_widths[2])}>
                  {showSkeleton ? (
                    <SkeletonTableCell />
                  ) : (
                    <Link href={value.link} className="underline">
                      Link
                    </Link>
                  )}
                </td>
                <td style={tdStyles(_widths[3])}>
                  {showSkeleton ? <SkeletonTableCell /> : value.workspaceName}
                </td>
                <td style={tdStyles(_widths[4])}>
                  {showSkeleton ? <SkeletonTableCell /> : value.updated?.at?.toString()}
                </td>
                <td style={tdStyles(_widths[5])}>
                  {showSkeleton ? <SkeletonTableCell /> : value.starred ? 'Yes' : 'No'}
                </td>
              </tr>
            );
            return isDragged ? (
              <table style={{ ...props.style, borderSpacing: 0 }}>
                <tbody>{row}</tbody>
              </table>
            ) : (
              row
            );
          }}
        />
      </div>
      <div ref={ref} style={{ height: '1px' }}></div>
    </div>
  );
};

export default TableList;

// TODO : this still has some bugs 