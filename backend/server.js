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
        
        // 👉 lấy uidHash dạng HEX từ chuỗi MQTT (ESP32 đã gửi dưới dạng HEX: uidHash: ea68f834)
        const match = msgStr.match(/uidHash:\s*([0-9a-fA-F]+)/i);

        if (match) {
            const uidHex = match[1].toUpperCase();
            
            // Xóa logic parse thập phân dư thừa
            const newMsg = msgStr; // Không cần replace vì chuỗi gốc đã chứa đúng UID

            console.log(`[Extracted HEX] ${uidHex}`);
            io.emit('new_data', {
                raw: msgStr,
                formatted: newMsg,
                uid: uidHex,
                timestamp: new Date().toLocaleTimeString()
            });

            // Process DB logic directly from server (Hardware to DB)
            const result = await attendanceController.processScanLogic(uidHex, io);
            
            // Nếu không thành công, phát sự kiện lỗi cho Classroom Display
            if (!result.success) {
                io.emit('scan_error', { 
                    message: result.message,
                    uid: uidHex,
                    timestamp: new Date().toLocaleTimeString()
                });
            }
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