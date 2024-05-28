"use client"

import React, { FC, useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';

const CardMarket: FC = () => {
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(true);
        }, 2000); // Simulating a 2-second loading delay

        return () => clearTimeout(timer); // Clean up the timer on unmount
    }, []);

    return (
        <div>
            <Card>
                <CardHeader>
                    {loading ? <Skeleton /> : <CardTitle>Card Title</CardTitle>}
                    {loading ? <Skeleton /> : <CardDescription>Card Description</CardDescription>}
                </CardHeader>
                <CardContent>
                    <p>Card Content</p>
                </CardContent>
                <CardFooter>
                    {loading ? <SkeletonButton /> : <Button className='w-full'>Add it to Workspace</Button>}
                </CardFooter>
            </Card>
        </div>
    )
}

// Skeleton component for loading effect
const Skeleton: FC = () => {
    return (
        <>
        <div className="animate-pulse dark:bg-green-100 bg-green-500 h-6 w-full my-1 rounded-md"></div>
        <div className="animate-pulse dark:bg-green-100 bg-green-500 h-6 w-full my-1 rounded-md"></div>
        </>
    );
}

// Skeleton button component for loading effect
const SkeletonButton: FC = () => {
    return (
        <div className="animate-pulse dark:bg-green-400 bg-green-900  h-9 w-full rounded-full my-2"></div>
    );
}

export default CardMarket;
