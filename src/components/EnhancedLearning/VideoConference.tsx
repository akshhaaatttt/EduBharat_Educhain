import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const VideoConference: React.FC = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [roomId, setRoomId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isInRoom, setIsInRoom] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<string>('Not initialized');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const initializeCamera = async () => {
    try {
      setCameraStatus('Requesting camera access...');
      setError('');
      
      console.log('Requesting camera and microphone access...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
        },
        audio: true
      });
      
      console.log('Media stream obtained successfully:', stream);
      console.log('Video tracks:', stream.getVideoTracks().length);
      console.log('Audio tracks:', stream.getAudioTracks().length);
      
      setLocalStream(stream);
      setCameraStatus('Camera initialized successfully');
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        console.log('Video element source set');
        
        // Add event listeners for debugging
        localVideoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          setCameraStatus('Video metadata loaded');
        };
        
        localVideoRef.current.oncanplay = () => {
          console.log('Video can play');
          setCameraStatus('Video ready to play');
        };
        
        localVideoRef.current.onplay = () => {
          console.log('Video started playing');
          setCameraStatus('Video playing');
        };
        
        // Try to play the video
        try {
          await localVideoRef.current.play();
          console.log('Video play successful');
          setCameraStatus('Video playing successfully');
        } catch (playError) {
          console.warn('Video autoplay failed, user interaction needed:', playError);
          setCameraStatus('Video ready (click to play)');
        }
      } else {
        console.error('Video element not found');
        setCameraStatus('Video element not found');
      }
      
      return stream;
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraStatus('Camera access failed');
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Camera access denied. Please allow camera permissions in your browser.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera found. Please check if your camera is connected.');
        } else if (err.name === 'NotReadableError') {
          setError('Camera is already in use by another application.');
        } else {
          setError(`Camera error: ${err.message}`);
        }
      } else {
        setError('Unknown camera error occurred.');
      }
      return null;
    }
  };

  const stopCamera = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
        console.log(`Stopped ${track.kind} track`);
      });
      setLocalStream(null);
      setCameraStatus('Camera stopped');
    }
    
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  const createRoom = async () => {
    if (!roomId.trim()) {
      setError('Please enter a room ID');
      return;
    }

    const stream = await initializeCamera();
    if (stream) {
      setIsInRoom(true);
      setError('');
    }
  };

  const joinRoom = async () => {
    if (!roomId.trim()) {
      setError('Please enter a room ID');
      return;
    }

    const stream = await initializeCamera();
    if (stream) {
      setIsInRoom(true);
      setError('');
    }
  };

  const leaveRoom = () => {
    stopCamera();
    setIsInRoom(false);
    setError('');
    setCameraStatus('Not initialized');
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-black text-white p-4">
      <div className="flex-1 flex flex-col space-y-4">
        <Card className="bg-gray-900 border-gray-700 p-4">
          <h2 className="text-xl font-bold text-[#39FF14] mb-4">Video Conference</h2>
          
          {!isInRoom ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Room ID</label>
                <Input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter room ID"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={createRoom}
                  className="bg-[#39FF14] text-black hover:bg-[#39FF14]/80"
                >
                  Create Room
                </Button>
                <Button 
                  onClick={joinRoom}
                  className="bg-[#39FF14] text-black hover:bg-[#39FF14]/80"
                >
                  Join Room
                </Button>
                <Button 
                  onClick={initializeCamera}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Test Camera
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg">Room: {roomId}</h3>
                <Button 
                  onClick={leaveRoom}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Leave Room
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={toggleMute}
                  className={`${isMuted ? 'bg-red-600' : 'bg-green-600'} hover:opacity-80`}
                >
                  {isMuted ? 'Unmute' : 'Mute'}
                </Button>
                <Button 
                  onClick={toggleVideo}
                  className={`${isVideoOff ? 'bg-red-600' : 'bg-green-600'} hover:opacity-80`}
                >
                  {isVideoOff ? 'Turn On Video' : 'Turn Off Video'}
                </Button>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded text-red-200">
              {error}
            </div>
          )}
          
          <div className="mt-4 text-sm text-gray-400">
            Status: {cameraStatus}
          </div>
        </Card>

        {/* Video Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Local Video */}
          <Card className="bg-gray-900 border-gray-700 p-4">
            <h3 className="text-sm font-medium mb-2 text-[#39FF14]">You (Local)</h3>
            <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                controls={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  backgroundColor: '#1f2937'
                }}
                onLoadedMetadata={() => {
                  console.log('Local video metadata loaded');
                  setCameraStatus('Local video loaded');
                }}
                onCanPlay={() => {
                  console.log('Local video can play');
                  setCameraStatus('Local video ready');
                }}
                onPlay={() => {
                  console.log('Local video started playing');
                  setCameraStatus('Local video playing');
                }}
                onError={(e) => {
                  console.error('Local video error:', e);
                  setCameraStatus('Local video error');
                }}
              />
              {!localStream && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📹</div>
                    <div>Camera not started</div>
                  </div>
                </div>
              )}
              {localStream && isVideoOff && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-400">Video Off</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoConference;
 