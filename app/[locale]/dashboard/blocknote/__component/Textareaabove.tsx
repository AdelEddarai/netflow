"use client"

import { useState, useMemo } from "react";
import Cover from "./Cover";
import { Button } from "@/components/ui/button";

export default function TextAreabove() {
  const [coverUrl, setCoverUrl] = useState<string>();

  const enableCover = async () => {
    const randomImage = await fetch(
      "https://images.unsplash.com/photo-1417325384643-aac51acc9e5d?q=75&fm=jpg&w=400&fit=max"
    );
    setCoverUrl(randomImage.url);
  };

  const removeCover = () => {
    setCoverUrl(undefined);
  };

  return (
    <>
      <Cover url={coverUrl} setUrl={setCoverUrl} />
      <div className="flex flex-col w-full">
        <div className="group flex flex-col gap-2">
          {!coverUrl && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant={'outline'}
                className="hover:bg-green-600 text-neutral-400 rounded-md px-3 py-1 transition-colors"
                onClick={enableCover}
              >
                📷 Add cover
              </Button>
            </div>
          )}
          {coverUrl && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant={'outline'}
                className="hover:bg-green-600 text-neutral-400 rounded-md px-3 py-1 transition-colors"
                onClick={removeCover}
              >
                🗑️ Remove cover
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
