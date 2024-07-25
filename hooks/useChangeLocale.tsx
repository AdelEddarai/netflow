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
      // Split the pathname into segments
      const segments = pathname.split('/');
      
      // Replace the locale segment (assumed to be the first one)
      segments[1] = nextLocale;
      
      // Join the segments back into a path
      const newPathname = segments.join('/');
      
      // Use router.push instead of replace to navigate to the new locale
      router.push(newPathname);
    });
  };

  return { isLoading, isPending, onSelectChange };
};