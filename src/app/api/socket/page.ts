import { Server } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as HTTPServer } from 'http';
import { Socket as NetSocket } from 'net';

export const config = {
  api: {
    bodyParser: false,
  },
};

type NextApiResponseWithSocket = NextApiResponse & {
  socket: NetSocket & {
    server: HTTPServer & {
      io?: Server;
    };
  };
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.IO server...');
    const io = new Server(res.socket.server, {
      path: '/api/socket',
    });

    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      socket.on('sendMessage', (message) => {
        console.log('Message received:', message);
        io.emit('receiveMessage', message);
      });

      socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
      });
  
      socket.on('callUser', (data) => {
        io.to(data.userToCall).emit('callUser',
           { signal: data.signal, from: data.from });
      });
    
      socket.on('answerCall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
      });
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log('Socket.IO server already initialized.');
  }
  res.end();
};

export default ioHandler;
