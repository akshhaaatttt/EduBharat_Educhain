import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { io, Socket } from 'socket.io-client';

interface Participant {
  id: string;
  name: string;
  stream: MediaStream | null;
}

const VideoConference: React.FC = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [roomId, setRoomId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isHost, setIsHost] = useState(false);
  const [isInRoom, setIsInRoom] = useState(false);
  
  const socketRef = useRef<Socket | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const userIdRef = useRef<string>(`user-${Math.random().toString(36).substr(2, 9)}`);
  const peerConnectionsRef = useRef<{ [key: string]: RTCPeerConnection }>({});

  const initializeLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError('Failed to access camera and microphone');
      return null;
    }
  };

  const createPeerConnection = (userId: string) => {
    console.log(`Creating peer connection for user: ${userId}`);
    
    // If a peer connection already exists for this user, return it
    if (peerConnectionsRef.current[userId]) {
      console.log(`Peer connection already exists for user: ${userId}`);
      return peerConnectionsRef.current[userId];
    }

    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Add local tracks to the peer connection
    if (localStream) {
      console.log('Adding local tracks to peer connection');
      localStream.getTracks().forEach(track => {
        console.log(`Adding track: ${track.kind}`);
        peerConnection.addTrack(track, localStream);
      });
    } else {
      console.error('No local stream available when creating peer connection');
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socketRef.current?.connected) {
        console.log(`Sending ICE candidate to ${userId}`);
        socketRef.current.emit('ice-candidate', {
          roomId,
          userId: userIdRef.current,
          targetUserId: userId,
          candidate: event.candidate
        });
      }
    };

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      console.log(`Received remote stream for user: ${userId}`);
      console.log('Stream tracks:', event.streams[0].getTracks());
      setParticipants(prev => prev.map(p => 
        p.id === userId ? { ...p, stream: event.streams[0] } : p
      ));
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log(`Connection state changed for ${userId}:`, peerConnection.connectionState);
      if (peerConnection.connectionState === 'connected') {
        console.log(`Peer connection established with: ${userId}`);
      } else if (peerConnection.connectionState === 'failed') {
        console.error(`Peer connection failed with: ${userId}`);
      }
    };

    peerConnectionsRef.current[userId] = peerConnection;
    return peerConnection;
  };

  const handleUserJoined = async (userId: string) => {
    console.log(`Handling user joined: ${userId}`);
    
    if (!localStream) {
      console.log('Initializing local stream for new participant');
      const stream = await initializeLocalStream();
      if (!stream) {
        console.error('Failed to initialize local stream');
        return;
      }
    }

    // Add the new participant to the list
    setParticipants(prev => [...prev, {
      id: userId,
      name: `User${Math.floor(Math.random() * 1000)}`,
      stream: null
    }]);

    // Create peer connection for the new user
    const peerConnection = createPeerConnection(userId);

    try {
      console.log(`Creating offer for user: ${userId}`);
      // Create and send offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      if (socketRef.current?.connected) {
        console.log(`Sending offer to user: ${userId}`);
        socketRef.current.emit('offer', {
          roomId,
          userId: userIdRef.current,
          targetUserId: userId,
          offer
        });
      } else {
        console.error('Socket not connected when trying to send offer');
      }
    } catch (err) {
      console.error('Error creating offer:', err);
      setError('Failed to establish connection');
    }
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit, userId: string) => {
    console.log(`Handling offer from user: ${userId}`);
    
    if (!localStream) {
      console.log('Initializing local stream for offer handling');
      const stream = await initializeLocalStream();
      if (!stream) {
        console.error('Failed to initialize local stream');
        return;
      }
    }

    // Create peer connection for the offering user
    const peerConnection = createPeerConnection(userId);

    try {
      console.log(`Setting remote description for user: ${userId}`);
      // Set remote description and create answer
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      if (socketRef.current?.connected) {
        console.log(`Sending answer to user: ${userId}`);
        socketRef.current.emit('answer', {
          roomId,
          userId: userIdRef.current,
          targetUserId: userId,
          answer
        });
      } else {
        console.error('Socket not connected when trying to send answer');
      }
    } catch (err) {
      console.error('Error handling offer:', err);
      setError('Failed to establish connection');
    }
  };

  const handleAnswer = async (answer: RTCSessionDescriptionInit, userId: string) => {
    console.log(`Handling answer from user: ${userId}`);
    const peerConnection = peerConnectionsRef.current[userId];
    if (peerConnection) {
      try {
        console.log(`Setting remote description for answer from user: ${userId}`);
        // Set remote description for the answer
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (err) {
        console.error('Error handling answer:', err);
        setError('Failed to establish connection');
      }
    } else {
      console.error(`No peer connection found for user: ${userId}`);
    }
  };

  const handleIceCandidate = async (candidate: RTCIceCandidateInit, userId: string) => {
    const peerConnection = peerConnectionsRef.current[userId];
    if (peerConnection) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error('Error handling ICE candidate:', err);
      }
    }
  };

  const handleUserLeft = (userId: string) => {
    const peerConnection = peerConnectionsRef.current[userId];
    if (peerConnection) {
      peerConnection.close();
      delete peerConnectionsRef.current[userId];
    }
    setParticipants(prev => prev.filter(p => p.id !== userId));
  };

  useEffect(() => {
    const socket = io('http://localhost:3001');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to signaling server');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('user-joined', (data) => {
      console.log('User joined:', data.userId);
      handleUserJoined(data.userId);
    });

    socket.on('offer', (data) => {
      console.log('Received offer from:', data.userId);
      handleOffer(data.offer, data.userId);
    });

    socket.on('answer', (data) => {
      console.log('Received answer from:', data.userId);
      handleAnswer(data.answer, data.userId);
    });

    socket.on('ice-candidate', (data) => {
      console.log('Received ICE candidate from:', data.userId);
      handleIceCandidate(data.candidate, data.userId);
    });

    socket.on('user-left', (data) => {
      console.log('User left:', data.userId);
      handleUserLeft(data.userId);
    });

    // Handle existing participants when joining a room
    socket.on('existing-participants', (participants) => {
      console.log('Received existing participants:', participants);
      participants.forEach((participant: any) => {
        if (participant.id !== userIdRef.current) {
          console.log(`Creating connection for existing participant: ${participant.id}`);
          handleUserJoined(participant.id);
        }
      });
    });

    return () => {
      console.log('Cleaning up socket and peer connections');
      socket.disconnect();
      // Clean up peer connections
      Object.values(peerConnectionsRef.current).forEach(peerConnection => {
        peerConnection.close();
      });
      peerConnectionsRef.current = {};
    };
  }, []);

  const createRoom = async () => {
    if (!roomId) {
      setError('Please enter a room ID');
      return;
    }

    const stream = await initializeLocalStream();
    if (!stream) return;

    if (socketRef.current?.connected) {
      socketRef.current.emit('create-room', {
        roomId,
        userId: userIdRef.current
      });
      setIsHost(true);
      setIsInRoom(true);
    }
  };

  const joinRoom = async () => {
    if (!roomId) {
      setError('Please enter a room ID');
      return;
    }

    const stream = await initializeLocalStream();
    if (!stream) return;

    if (socketRef.current?.connected) {
      socketRef.current.emit('join-room', {
        roomId,
        userId: userIdRef.current
      });
      setIsInRoom(true);
    }
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        screenStreamRef.current = screenStream;

        // Replace video track in all peer connections
        Object.values(peerConnectionsRef.current).forEach(peerConnection => {
          const videoTrack = screenStream.getVideoTracks()[0];
          const sender = peerConnection.getSenders().find(s => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
      } else {
        if (screenStreamRef.current) {
          screenStreamRef.current.getTracks().forEach(track => track.stop());
        }

        // Restore camera track in all peer connections
        if (localStream) {
          Object.values(peerConnectionsRef.current).forEach(peerConnection => {
            const videoTrack = localStream.getVideoTracks()[0];
            const sender = peerConnection.getSenders().find(s => s.track?.kind === 'video');
            if (sender) {
              sender.replaceTrack(videoTrack);
            }
          });
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }
      }

      setIsScreenSharing(!isScreenSharing);
    } catch (err) {
      console.error('Error toggling screen share:', err);
      setError('Failed to share screen');
    }
  };

  const endRoom = () => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('end-room', {
        roomId,
        userId: userIdRef.current
      });
    }

    // Close all peer connections
    Object.values(peerConnectionsRef.current).forEach(peerConnection => {
      peerConnection.close();
    });
    peerConnectionsRef.current = {};

    // Stop all media tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }

    // Reset states
    setLocalStream(null);
    setParticipants([]);
    setIsMuted(false);
    setIsVideoOff(false);
    setIsScreenSharing(false);
    setIsHost(false);
    setIsInRoom(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {!isInRoom ? (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Join Video Conference</h2>
            <div className="space-y-4">
              <Input
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              {error && <p className="text-red-500">{error}</p>}
              <div className="flex gap-4">
                <Button onClick={createRoom}>Create Room</Button>
                <Button onClick={joinRoom}>Join Room</Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Video Conference</h2>
              <div className="flex gap-2">
                <Button onClick={toggleMute}>
                  {isMuted ? 'Unmute' : 'Mute'}
                </Button>
                <Button onClick={toggleVideo}>
                  {isVideoOff ? 'Show Video' : 'Hide Video'}
                </Button>
                <Button onClick={toggleScreenShare}>
                  {isScreenSharing ? 'Stop Share' : 'Share Screen'}
                </Button>
                <Button onClick={endRoom} variant="destructive">
                  End Call
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Your Video</h3>
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-lg"
                />
              </div>

              {participants.map((participant) => (
                <div key={participant.id} className="bg-white rounded-lg shadow-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">{participant.name}</h3>
                  <video
                    autoPlay
                    playsInline
                    className="w-full rounded-lg"
                    ref={(video) => {
                      if (video && participant.stream) {
                        video.srcObject = participant.stream;
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoConference; 