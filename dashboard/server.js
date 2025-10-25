const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');
const { status } = require('minecraft-server-util');
const si = require('systeminformation');

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
const MINECRAFT_HOST = process.env.MINECRAFT_HOST || 'localhost';
const MINECRAFT_PORT = process.env.MINECRAFT_PORT || 25565;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Server status tracking
let serverStatus = {
  running: false,
  players: [],
  maxPlayers: 20,
  uptime: 0,
  tps: 20,
  memory: { used: 0, max: 0 },
  version: '',
  motd: '',
  lastUpdate: new Date()
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

app.get('/api/system', async (req, res) => {
  try {
    const systemInfo = await getSystemInfo();
    res.json(systemInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get system info' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    server: serverStatus.running ? 'online' : 'offline'
  });
});

// Socket.IO for real-time communication
io.on('connection', (socket) => {
  console.log('Dashboard client connected');
  
  socket.emit('server-status', serverStatus);
  
  socket.on('disconnect', () => {
    console.log('Dashboard client disconnected');
  });
});

// Real server monitoring functions
async function checkMinecraftServer() {
  try {
    const response = await status(MINECRAFT_HOST, MINECRAFT_PORT, {
      timeout: 5000,
      enableSRV: true
    });
    
    serverStatus.running = true;
    serverStatus.players = response.players.sample || [];
    serverStatus.maxPlayers = response.players.max;
    serverStatus.version = response.version.name;
    serverStatus.motd = response.motd.clean;
    serverStatus.uptime += 5; // Increment by 5 seconds
    serverStatus.lastUpdate = new Date();
    
    // Get system memory info
    const memInfo = await si.mem();
    serverStatus.memory.used = Math.round(memInfo.used / 1024 / 1024); // Convert to MB
    serverStatus.memory.max = Math.round(memInfo.total / 1024 / 1024); // Convert to MB
    
    // Estimate TPS based on server performance (simplified)
    serverStatus.tps = Math.min(20, Math.max(10, 20 - (serverStatus.memory.used / serverStatus.memory.max) * 10));
    
  } catch (error) {
    console.log('Minecraft server not reachable:', error.message);
    serverStatus.running = false;
    serverStatus.players = [];
    serverStatus.lastUpdate = new Date();
  }
}

async function getSystemInfo() {
  try {
    const memInfo = await si.mem();
    const cpuInfo = await si.currentLoad();
    
    return {
      memory: {
        used: Math.round(memInfo.used / 1024 / 1024),
        total: Math.round(memInfo.total / 1024 / 1024),
        percentage: Math.round((memInfo.used / memInfo.total) * 100)
      },
      cpu: {
        usage: Math.round(cpuInfo.currentLoad)
      }
    };
  } catch (error) {
    console.error('Failed to get system info:', error);
    return null;
  }
}

// Real server monitoring
setInterval(async () => {
  await checkMinecraftServer();
  const systemInfo = await getSystemInfo();
  
  if (systemInfo) {
    serverStatus.memory = systemInfo.memory;
  }
  
  io.emit('server-status', serverStatus);
}, 5000);

// Start server
server.listen(PORT, () => {
  console.log(`Minecraft Dashboard running on port ${PORT}`);
  console.log(`Server path: ${SERVER_PATH}`);
});
