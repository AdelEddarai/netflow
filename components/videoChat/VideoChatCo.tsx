'use client';

import '@livekit/components-styles';
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
  Chat,
  VideoConference,
  LayoutContextProvider,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useEffect, useState } from 'react';

interface PageProps {
  roomId: string;
  userName: string;
}

export default function Page({ roomId, userName }: PageProps) {
  const [token, setToken] = useState('');
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`/api/get-participant-token?room=${roomId}&username=${userName}`);
        const data = await resp.json();
        if (data.error) {
          setError(data.error);
          return;
        }
        setToken(data.token);
      } catch (e) {
        setError('Failed to fetch token');
        console.error("Error fetching token:", e);
      }
    })();
  }, [roomId, userName]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (token === '') {
    return <div>Getting token...</div>;
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      style={{ height: '100dvh' }}
    >
      <LayoutContextProvider>
        <div className="relative h-full">
          <MyVideoConference />
          <VideoConference />
          <RoomAudioRenderer />
          <ControlBar />
          <button
            className="absolute bottom-20 right-5 bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => setIsChatVisible(!isChatVisible)}
          >
            Toggle Chat
          </button>
          {isChatVisible && (
            <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-white shadow-lg border border-gray-200">
              <Chat />
            </div>
          )}
        </div>
      </LayoutContextProvider>
    </LiveKitRoom>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      <ParticipantTile />
    </GridLayout>
  );
}
