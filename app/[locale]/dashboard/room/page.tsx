"use client";

import "@livekit/components-styles";
import {
  LiveKitRoom,
  VideoConference,
} from "@livekit/components-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader } from 'lucide-react';
import { MdMinimize, MdMaximize } from "react-icons/md";

export default function Page() {
  const params = useSearchParams();
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const room = params.get("room");
    const name = params.get("name");
    if (room && name) {
      setRoom(room);
      setName(name);
    }
  }, [params]);

  async function getToken() {
    if (!room || !name) return;
    setIsLoading(true);
    try {
      const resp = await fetch(`/api/get-participant-token?room=${room}&username=${name}`);
      const data = await resp.json();
      setTimeout(() => {
        setToken(data.token);
        setIsLoading(false);
      }, 4000);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const img = new Image();
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.clientX && e.clientY) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  };

  if (token === "") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Join netflow Room</CardTitle>
            <CardDescription>Enter your room and name to join the video conference.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); getToken(); }}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="room">Room</Label>
                  <Input id="room" placeholder="Enter room name" value={room} onChange={(e) => setRoom(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={getToken} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                'Join'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className={isMinimized ? "fixed" : ""}
      style={isMinimized ? { left: `${position.x}px`, top: `${position.y}px` } : {}}
      draggable={isMinimized}
      onDragStart={handleDragStart}
      onDrag={handleDrag}>
      
      {isHovered && (
        <Button 
          onClick={() => setIsMinimized(!isMinimized)}
          className="absolute top-2 right-2 z-10 p-2 bg-opacity-50 hover:bg-opacity-100 transition-opacity"
        >
          {isMinimized ? <MdMinimize size={16} /> : <MdMaximize size={16} />}
        </Button>
      )}
      
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        onDisconnected={() => setToken("")}
        data-lk-theme="default"
        style={isMinimized ? { height: "100px", width: "100px", borderRadius: "50%", overflow: "hidden" } : { height: "100dvh" }}
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
}