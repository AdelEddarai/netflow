'use client';

import Page from '@/components/videoChat/VideoChatCo';
import { useSearchParams } from 'next/navigation';


export default function Room() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get('id');
  const userName = searchParams.get('name');

  console.log('Received room:', roomId);
  console.log('Received username:', userName);

  if (!roomId || !userName) {
    console.log('Room ID or username is null.');
    return <div>Loading...</div>;
  }

  return (
    <Page roomId={roomId} userName={userName} />
  );
}