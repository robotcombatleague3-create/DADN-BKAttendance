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
const TOPIC = 'test/vinh/mqtt';

mqttClient.on('connect', () => {
    console.log('✅ Đã kết nối HiveMQ Broker');
    mqttClient.subscribe(TOPIC);
    console.log(`👂 Đang lắng nghe topic: ${TOPIC}`);
});

// 3. Nhận tin nhắn MQTT và đẩy thẳng lên Web qua Socket
mqttClient.on('message', (topic, message) => {
    if (topic === TOPIC) {
        const msgStr = message.toString();
        console.log(`[MQTT Nhận] ${msgStr}`);

        // 👉 lấy uidHash dạng DEC
        const match = msgStr.match(/uidHash:\s*(\d+)/);

        if (match) {
            const uidDec = parseInt(match[1]);

            // 👉 convert sang HEX
            const uidHex = uidDec.toString(16).toUpperCase();

            // 👉 thay lại trong chuỗi
            const newMsg = msgStr.replace(
                /uidHash:\s*\d+/,
                `uidHash: ${uidHex}`
            );

            console.log(`[Converted HEX] ${newMsg}`);

            // gửi lên web
            io.emit('new_data', {
                raw: msgStr,
                formatted: newMsg,
                uid: uidHex,
                timestamp: new Date().toLocaleTimeString()
            });
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