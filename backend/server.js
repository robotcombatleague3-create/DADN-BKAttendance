const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Import routes
const studentRoutes = require('./src/routes/studentRoutes');
const attendanceRoutes = require('./src/routes/attendanceRoutes');

const app = express();
const server = http.createServer(app);

// Socket.io config
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Pass IO instance to routes via req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// REST API Routes
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
