require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mqtt = require('mqtt');
const cors = require('cors');

// Import routes
const studentRoutes = require('./src/routes/studentRoutes');
const attendanceRoutes = require('./src/routes/attendanceRoutes');
const classRoutes = require('./src/routes/classRoutes');
const statsRoutes = require('./src/routes/statsRoutes');
const lecturerRoutes = require('./src/routes/lecturerRoutes');

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
app.use('/api/classes', classRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/lecturers', lecturerRoutes);

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');
const TOPIC_FROM_ESP = 'test/vinh/mqtt/send'; 
const TOPIC_TO_ESP = 'test/vinh/mqtt/recv';   

mqttClient.on('connect', () => {
    console.log('✅ Đã kết nối HiveMQ Broker');
    mqttClient.subscribe(TOPIC_FROM_ESP);
});

// Import controller for DB logic
const attendanceController = require('./src/controllers/attendanceController');

mqttClient.on('message', async (topic, message) => {
    if (topic === TOPIC_FROM_ESP) {
        const msgStr = message.toString();
        console.log(`[MQTT nhận]: ${msgStr}`);
        
        // 👉 lấy uidHash dạng DEC
        const match = msgStr.match(/uidHash:\s*(\d+)/);

        if (match) {
            const uidDec = parseInt(match[1]);
            const uidHex = uidDec.toString(16).toUpperCase();
            const newMsg = msgStr.replace(/uidHash:\s*\d+/, `uidHash: ${uidHex}`);

            console.log(`[Converted HEX] ${newMsg}`);
            io.emit('new_data', {
                raw: msgStr,
                formatted: newMsg,
                uid: uidHex,
                timestamp: new Date().toLocaleTimeString()
            });

            // Process DB logic directly from server (Hardware to DB)
            await attendanceController.processScanLogic(uidHex, io);
        } else {
            io.emit('new_data', {
                raw: msgStr,
                formatted: msgStr,
                uid: null,
                timestamp: new Date().toLocaleTimeString()
            });
        }
    }
});

io.on('connection', (socket) => {
    socket.on('send_command', (msg) => {
        mqttClient.publish(TOPIC_TO_ESP, msg);
    });
});