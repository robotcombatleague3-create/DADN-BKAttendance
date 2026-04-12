import { io } from 'socket.io-client';

export const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('🔗 Đã kết nối Socket.io với server:', socket.id);
});

socket.on('disconnect', () => {
  console.log('❌ Mất kết nối server');
});
