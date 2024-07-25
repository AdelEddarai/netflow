'use client';
import { Share } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Control({ url }: { url: string }): React.ReactElement {
  const [open, setOpen] = useState(false);
  const onClick = (): void => {
    setOpen(true);
    void navigator.clipboard.writeText(`${window.location.origin}${url}`);
    setTimeout(() => setOpen(false), 2000); // Close tooltip after 2 seconds
  };

  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            className="gap-2"
            onClick={onClick}
          >
            <Share className="h-4 w-4" />
            Share Post
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Copied
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}