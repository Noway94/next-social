// src/components/SocketClient.tsx
"use client";

import { useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketClient = () => {
  useEffect(() => {
    const socket = io({
      path: '/api/socket' // Ensure the path is relative to the root
    });

    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
};

export default SocketClient;
