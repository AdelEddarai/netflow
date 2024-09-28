"use client"

import { useState, useMemo } from "react";
import Cover from "./Cover";
import { Button } from "@/components/ui/button";

export default function TextAreabove() {
  const [coverUrl, setCoverUrl] = useState<string>();

  const enableCover = async () => {
    const randomImage = await fetch(
      "https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
            <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-8">
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
