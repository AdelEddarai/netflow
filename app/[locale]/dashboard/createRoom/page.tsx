'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateRoom() {
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const [roomUrl, setRoomUrl] = useState('');
  const router = useRouter();

  const handleCreateRoom = async () => {
    if (!roomName || !userName) {
      alert('Please enter both room name and user name.');
      return;
    }

    // Generate a unique room ID
    const roomId = Math.random().toString(36).substr(2, 9);
    const url = `${window.location.origin}/dashboard/room/${roomId}?name=${encodeURIComponent(userName)}`;
    // You might want to save the room info to your backend here

    setRoomUrl(url);
  };

  const handleJoinRoom = () => {
    if (roomUrl) {
      router.push(roomUrl);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Create a Room</h1>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <input
          type="text"
          className="w-full p-2 mb-4 border rounded"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <input
          type="text"
          className="w-full p-2 mb-4 border rounded"
          placeholder="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button
          onClick={handleCreateRoom}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Create Room
        </button>
        {roomUrl && (
          <div className="mt-4">
            <p className="text-center mb-2">Share this link to join the room:</p>
            <div className="bg-gray-100 p-2 rounded border text-center">
              <a href={roomUrl} className="text-blue-500 underline">
                {roomUrl}
              </a>
            </div>
            <button
              onClick={handleJoinRoom}
              className="w-full mt-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Join Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
