const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 6060;
const SERVER_PATH = process.env.SERVER_PATH || '/data/server';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Server status tracking
let serverStatus = {
  running: false,
  players: [],
  uptime: 0,
  tps: 20,
  memory: { used: 0, max: 0 }
};

// Routes
app.get('/api/status', (req, res) => {
  res.json(serverStatus);
});

app.get('/api/logs', async (req, res) => {
  try {
    const logPath = path.join(SERVER_PATH, 'logs', 'latest.log');
    const logs = await fs.readFile(logPath, 'utf8');
    const lines = logs.split('\n').slice(-100); // Last 100 lines
    res.json({ logs: lines });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read logs' });
  }
});

app.post('/api/command', (req, res) => {
  const { command } = req.body;
  if (!command) {
    return res.status(400).json({ error: 'Command is required' });
  }
  
  // Send command to server (this would need to be implemented with actual server communication)
  io.emit('server-command', command);
  res.json({ success: true, message: 'Command sent to server' });
});

app.get('/api/players', (req, res) => {
  res.json({ players: serverStatus.players });
});

// Socket.IO for real-time communication
io.on('connection', (socket) => {
  console.log('Dashboard client connected');
  
  socket.emit('server-status', serverStatus);
  
  socket.on('disconnect', () => {
    console.log('Dashboard client disconnected');
  });
});

// Simulate server monitoring (in real implementation, this would connect to actual server)
setInterval(() => {
  // Simulate server metrics
  serverStatus.uptime += 1;
  serverStatus.tps = 15 + Math.random() * 10;
  serverStatus.memory.used = Math.floor(Math.random() * 2048);
  serverStatus.memory.max = 4096;
  
  io.emit('server-status', serverStatus);
}, 5000);

// Start server
server.listen(PORT, () => {
  console.log(`Minecraft Dashboard running on port ${PORT}`);
  console.log(`Server path: ${SERVER_PATH}`);
});
