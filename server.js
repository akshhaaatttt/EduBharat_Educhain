const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Store active rooms
const rooms = new Map();

// Store chat messages for collaboration
const chatMessages = new Map();

// Store build rooms and their participants
const buildRooms = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle connection errors
  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Find and clean up rooms where this user was a participant
    for (const [roomId, room] of rooms.entries()) {
      if (room.participants.has(socket.id)) {
        room.participants.delete(socket.id);
        
        // If host left, assign new host
        if (room.host === socket.id && room.participants.size > 0) {
          const newHost = Array.from(room.participants)[0];
          room.host = newHost;
          io.to(roomId).emit('new-host', { newHost });
        }
        
        // If room is empty, delete it
        if (room.participants.size === 0) {
          rooms.delete(roomId);
        }
      }
    }
  });

  // Handle room creation
  socket.on('create-room', (data) => {
    try {
      const { roomId, userId } = data;
      if (!roomId || !userId) {
        socket.emit('error', { message: 'Room ID and user ID are required' });
        return;
      }

      if (rooms.has(roomId)) {
        socket.emit('error', { message: 'Room already exists' });
        return;
      }

      rooms.set(roomId, {
        host: userId,
        participants: new Set([userId])
      });

      socket.join(roomId);
      socket.emit('room-created', { roomId });
    } catch (error) {
      console.error('Error creating room:', error);
      socket.emit('error', { message: 'Failed to create room' });
    }
  });

  // Handle room joining
  socket.on('join-room', (data) => {
    try {
      const { roomId, userId } = data;
      console.log(`User ${userId} attempting to join room ${roomId}`);
      
      if (!roomId || !userId) {
        console.error('Missing room ID or user ID');
        socket.emit('error', { message: 'Room ID and user ID are required' });
        return;
      }

      const room = rooms.get(roomId);
      if (!room) {
        console.error(`Room ${roomId} does not exist`);
        socket.emit('error', { message: 'Room does not exist' });
        return;
      }

      console.log(`Adding user ${userId} to room ${roomId}`);
      room.participants.add(userId);
      socket.join(roomId);
      socket.emit('room-joined', { roomId });

      // Send existing participants to the new joiner
      const existingParticipants = Array.from(room.participants)
        .filter(id => id !== userId)
        .map(id => ({ id, name: `User${Math.floor(Math.random() * 1000)}` }));
      
      console.log(`Sending ${existingParticipants.length} existing participants to user ${userId}`);
      socket.emit('existing-participants', existingParticipants);

      // Notify other participants about the new joiner
      console.log(`Notifying other participants about new user ${userId}`);
      socket.to(roomId).emit('user-joined', { userId });
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  // Handle room ending
  socket.on('end-room', (data) => {
    try {
      const { roomId, userId } = data;
      if (!roomId || !userId) {
        socket.emit('error', { message: 'Room ID and user ID are required' });
        return;
      }

      const room = rooms.get(roomId);
      if (!room) {
        socket.emit('error', { message: 'Room does not exist' });
        return;
      }

      if (room.host !== userId) {
        socket.emit('error', { message: 'Only the host can end the room' });
        return;
      }

      // Notify all participants
      io.to(roomId).emit('room-ended');
      
      // Clean up room
      rooms.delete(roomId);
    } catch (error) {
      console.error('Error ending room:', error);
      socket.emit('error', { message: 'Failed to end room' });
    }
  });

  // Handle WebRTC signaling
  socket.on('offer', (data) => {
    try {
      const { roomId, userId, targetUserId, offer } = data;
      console.log(`Received offer from ${userId} to ${targetUserId} in room ${roomId}`);
      socket.to(roomId).emit('offer', { userId, offer });
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  });

  socket.on('answer', (data) => {
    try {
      const { roomId, userId, targetUserId, answer } = data;
      console.log(`Received answer from ${userId} to ${targetUserId} in room ${roomId}`);
      socket.to(roomId).emit('answer', { userId, answer });
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  });

  socket.on('ice-candidate', (data) => {
    try {
      const { roomId, userId, targetUserId, candidate } = data;
      console.log(`Received ICE candidate from ${userId} to ${targetUserId} in room ${roomId}`);
      socket.to(roomId).emit('ice-candidate', { userId, candidate });
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  });

  // Collaboration Events
  socket.on('join-collaboration', (data) => {
    try {
      const { roomId, userId } = data;
      if (!roomId || !userId) {
        socket.emit('error', { message: 'Missing required fields' });
        return;
      }

      socket.join(roomId);
      
      if (!chatMessages.has(roomId)) {
        chatMessages.set(roomId, []);
      }
      
      socket.emit('existing-messages', {
        roomId,
        messages: chatMessages.get(roomId)
      });
    } catch (error) {
      console.error('Error joining collaboration:', error);
      socket.emit('error', { message: 'Error joining collaboration' });
    }
  });

  socket.on('message', (data) => {
    try {
      if (!data) {
        console.error('Message event received with no data');
        return;
      }

      const { roomId, message } = data;
      if (!roomId || !message) {
        console.error('Missing required fields in message:', data);
        return;
      }

      if (!chatMessages.has(roomId)) {
        chatMessages.set(roomId, []);
      }

      const messageWithId = {
        ...message,
        id: message.id || Date.now().toString(),
        timestamp: message.timestamp || new Date().toISOString()
      };

      chatMessages.get(roomId).push(messageWithId);
      io.to(roomId).emit('message', messageWithId);
    } catch (error) {
      console.error('Error handling message:', error);
      socket.emit('error', { message: 'Error handling message' });
    }
  });

  socket.on('typing', (data) => {
    try {
      if (!data) {
        console.error('Typing event received with no data');
        return;
      }

      const { roomId, userId } = data;
      if (!roomId || !userId) {
        console.error('Missing required fields in typing event:', data);
        return;
      }

      socket.to(roomId).emit('user-typing', { 
        userId, 
        isTyping: true 
      });
    } catch (error) {
      console.error('Error handling typing event:', error);
    }
  });

  socket.on('stopped-typing', (data) => {
    try {
      if (!data) {
        console.error('Stopped typing event received with no data');
        return;
      }

      const { roomId, userId } = data;
      if (!roomId || !userId) {
        console.error('Missing required fields in stopped typing event:', data);
        return;
      }

      socket.to(roomId).emit('user-stopped-typing', { 
        userId, 
        isTyping: false 
      });
    } catch (error) {
      console.error('Error handling stopped typing event:', error);
    }
  });

  // Let's Build Together Events
  socket.on('create-build-room', ({ name, description, owner }) => {
    try {
      if (!name || !owner) {
        throw new Error('Missing required fields');
      }

      const roomId = Date.now().toString();
      const room = {
        id: roomId,
        name,
        description,
        owner,
        participants: [owner],
        pullRequests: []
      };

      buildRooms.set(roomId, room);
      socket.join(roomId);
      socket.emit('room-created', { roomId });
      io.emit('rooms-updated', Array.from(buildRooms.values()));
      console.log(`Build room ${roomId} created by ${owner}`);
    } catch (error) {
      console.error('Error creating build room:', error);
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('join-build-room', ({ roomId, userId }) => {
    try {
      const room = buildRooms.get(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      if (!room.participants.includes(userId)) {
        room.participants.push(userId);
      }

      socket.join(roomId);
      socket.emit('room-joined', room);
      io.to(roomId).emit('user-joined', { userId });
      io.emit('rooms-updated', Array.from(buildRooms.values()));
      console.log(`User ${userId} joined build room ${roomId}`);
    } catch (error) {
      console.error('Error joining build room:', error);
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('leave-build-room', ({ roomId, userId }) => {
    try {
      const room = buildRooms.get(roomId);
      if (room) {
        room.participants = room.participants.filter(id => id !== userId);
        
        if (room.participants.length === 0) {
          buildRooms.delete(roomId);
        } else if (room.owner === userId) {
          room.owner = room.participants[0];
          io.to(roomId).emit('new-owner', { newOwner: room.owner });
        }

        socket.leave(roomId);
        io.to(roomId).emit('user-left', { userId });
        io.emit('rooms-updated', Array.from(buildRooms.values()));
        console.log(`User ${userId} left build room ${roomId}`);
      }
    } catch (error) {
      console.error('Error leaving build room:', error);
    }
  });

  socket.on('create-pull-request', ({ roomId, pullRequest }) => {
    try {
      const room = buildRooms.get(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      room.pullRequests.push(pullRequest);
      io.to(roomId).emit('pull-request-created', pullRequest);
      console.log(`Pull request created in room ${roomId}`);
    } catch (error) {
      console.error('Error creating pull request:', error);
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('review-pull-request', ({ roomId, pullRequestId, status }) => {
    try {
      const room = buildRooms.get(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      const pullRequest = room.pullRequests.find(pr => pr.id === pullRequestId);
      if (!pullRequest) {
        throw new Error('Pull request not found');
      }

      if (room.owner !== socket.id) {
        throw new Error('Only room owner can review pull requests');
      }

      pullRequest.status = status;
      io.to(roomId).emit('pull-request-updated', pullRequest);
      console.log(`Pull request ${pullRequestId} updated to ${status}`);
    } catch (error) {
      console.error('Error reviewing pull request:', error);
      socket.emit('error', { message: error.message });
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 