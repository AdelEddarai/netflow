
"use client"

import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { ClientError } from '../error/ClientError';
import { useTranslations } from 'next-intl';
import { Activity, TrendingUp } from 'lucide-react';
import { LoadingState } from '../ui/loading-state';
import { BarChart, YAxis, Tooltip, Legend, Bar, LineChart, Line, ResponsiveContainer, LabelList } from 'recharts';
import { ACTIVITY_PER_PAGE } from '@/lib/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useIntersection } from '@mantine/hooks';
import { HomeRecentActivity } from '@/types/extended';
import {
  ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"


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

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  } satisfies ChartConfig


  return (
    <div className='w-full mt-10 justify-center items-center grid grid-cols-1'>
      {/* <Card className='mt-8'>
        <h2 className='text-xl font-bold p-2'>Workspace Additions Per Day</h2>
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
      </Card> */}

      {/* Bar Chart */}

      <Card className='dark:bg-black'>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Bar Chart</CardTitle>
            <CardDescription>
              Workspace Additions Per Day
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full mt-2">
            <BarChart accessibilityLayer data={barChartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-desktop)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={lineChartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="count"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <Area
              dataKey="day"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card> */}

      {/* Line Chart */}
      {/* <Card className='mt-8'>
        <h2 className='text-xl font-bold p-2'>Trend of Workspace Additions</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={lineChartData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" color='green' />
          </LineChart>
        </ResponsiveContainer>
      </Card> */}

      <Card className="dark:bg-black mt-4">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Line Chart</CardTitle>
            <CardDescription>
              Workspace Additions Per Day
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}
            className="aspect-auto h-[250px] w-full">
            <LineChart
              accessibilityLayer
              data={lineChartData}
              margin={{
                top: 20,
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                dataKey="count"
                type="natural"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-mobile)",
                }}
                activeDot={{
                  r: 6,
                }}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Line>
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total workspace per month
          </div>
        </CardFooter>
      </Card>


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
