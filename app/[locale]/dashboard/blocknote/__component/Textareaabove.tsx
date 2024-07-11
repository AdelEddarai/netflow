"use client";

import { useState, useMemo } from "react";
import Cover from "./Cover";

export default function TextAreabove() {
  const [coverUrl, setCoverUrl] = useState<string>();

  const enableCover = async () => {
    const randomImage = await fetch(
      "https://source.unsplash.com/random/landscape"
    );
    setCoverUrl(randomImage.url);
  };

  return (
    <>
      <Cover url={coverUrl} setUrl={setCoverUrl} />
      <div className="flex flex-col w-full">
        <div className="group flex flex-col gap-2">
          {!coverUrl && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="hover:bg-neutral-100 text-neutral-400 rounded-md px-3 py-1 transition-colors"
                onClick={enableCover}
              >
                📷 Add cover
              </button>
            </div>
          )}
        </div>
      </div>
      </>
  );
}