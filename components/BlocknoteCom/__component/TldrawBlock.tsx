"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, Save, Upload } from "lucide-react";

const Excalidraw = dynamic(() => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw), { ssr: false });

const StyledWhiteboard = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

 
  const initialData = {
    appState: {
      viewBackgroundColor: "#0000", // Set your desired background color here
    },
  };

  return (
    <Card className={`dark:bg-black overflow-hidden transition-all duration-300 ease-in-out ${isFullscreen ? 'fixed inset-0 z-50' : 'h-[600px]'}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 mt-4">
        <CardTitle>Whiteboard</CardTitle>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className={`w-full ${isFullscreen ? 'h-[calc(100vh-4rem)]' : 'h-[550px]'}`}>
          <Excalidraw initialData={initialData} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StyledWhiteboard;
