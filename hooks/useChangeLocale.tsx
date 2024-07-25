'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export const useChangeLocale = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isPending, startTransition] = useTransition();

    const router = useRouter();
    const pathname = usePathname();

    const onSelectChange = (nextLocale: 'pl' | 'en') => {
        setIsLoading(true);
        startTransition(() => {
            const newPathname = `/${nextLocale}${pathname}`;
            router.push(newPathname);
        });
    };

    return { isLoading, isPending, onSelectChange };
};
