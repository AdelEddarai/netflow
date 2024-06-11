"use client";

import "@livekit/components-styles";
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
  VideoConference,
} from "@livekit/components-react";
import { useEffect, useState } from "react";
import { Track } from "livekit-client";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Page() {
  const params = useSearchParams();

  useEffect(() => {
    const room = params.get("room");
    const name = params.get("name");
    if (room && name) {
      setRoom(room);
      setName(name);
    }
  }, [params]);

  const [room, setRoom] = useState<string>();
  const [name, setName] = useState<string>();

  const [token, setToken] = useState("");

  async function getToken() {
    if (!room || !name) {
      return;
    }
    try {
      const resp = await fetch(
        `/api/get-participant-token?room=${room}&username=${name}`
      );
      const data = await resp.json();
      setToken(data.token);
    } catch (e) {
      console.error(e);
    }
  }

  if (token === "") {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          getToken();
        }}
        className="flex flex-col justify-center items-center min-h-screen"
      >
        <Input
          type="text"
          placeholder="Room"
          value={room}
          className="mb-4 ring-1"
          onChange={(e) => setRoom(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Name"
          value={name}
          className="mb-4 ring-1"
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          type="submit"
          className="p-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Join
        </Button>
      </form>
    );
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      onDisconnected={() => setToken("")}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      style={{ height: "100dvh" }}
    >
        <VideoConference />
    </LiveKitRoom>
  );
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}