// server.js
const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server, {
    path: '/api/socket',
  });

  io.on('connection', (socket) => {
   // console.log('New client connected:', socket.id);

    socket.on('sendMessage', (message) => {
   //   console.log('Message received:', message);
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

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
