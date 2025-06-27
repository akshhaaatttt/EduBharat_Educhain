import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import VideoConference from '../components/VideoConference';

const VideoCall: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // Generate a random user ID if not already set
    if (!userId) {
      setUserId(Math.random().toString(36).substring(2, 15));
    }
  }, [userId]);

  if (!roomId || !userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Video Conference</h1>
        <p className="mb-4">Room ID: {roomId}</p>
        <VideoConference roomId={roomId} userId={userId} />
      </div>
    </div>
  );
};

export default VideoCall; 