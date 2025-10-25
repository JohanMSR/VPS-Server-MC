# Minecraft Server Dashboard

A modern, real-time dashboard for monitoring Minecraft servers with Material UI design and real server data integration.

## Features

### ✅ Real Server Monitoring
- **Live Server Status**: Real-time connection to Minecraft server
- **Player Management**: Live player list with avatars
- **Performance Metrics**: Real TPS, memory usage, and memory utilization
- **System Information**: CPU and memory monitoring
- **Server Version**: Display server version and MOTD

### 🎨 Modern Material UI Design
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Material Design**: Clean, modern interface following Google's Material Design
- **Real-time Updates**: Live data updates via WebSocket
- **Interactive Console**: Send commands directly to the server
- **Server Logs**: View and refresh server logs in real-time

### 🔧 Technical Improvements
- **Real Data**: Replaced fake data simulation with actual server monitoring
- **Minecraft Server Integration**: Uses `minecraft-server-util` for real server queries
- **System Monitoring**: Uses `systeminformation` for accurate system metrics
- **WebSocket Communication**: Real-time updates without page refresh
- **Error Handling**: Robust error handling and fallback states

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (optional):
```bash
export MINECRAFT_HOST=localhost
export MINECRAFT_PORT=25565
export SERVER_PATH=/path/to/server
export PORT=6060
```

3. Start the dashboard:
```bash
npm start
```

## API Endpoints

- `GET /api/status` - Server status and metrics
- `GET /api/players` - Online players list
- `GET /api/logs` - Server logs
- `GET /api/system` - System information
- `GET /api/health` - Dashboard health check
- `POST /api/command` - Send command to server

## Real-time Features

The dashboard uses WebSocket connections for real-time updates:
- Server status changes
- Player join/leave events
- Performance metrics updates
- Console command responses

## Dependencies

- **Frontend**: React 18, Material UI 5, Socket.IO Client
- **Backend**: Express, Socket.IO, minecraft-server-util, systeminformation
- **Monitoring**: Real Minecraft server status, system metrics

## Configuration

The dashboard automatically detects your Minecraft server at `localhost:25565`. To monitor a different server, set the environment variables:

```bash
MINECRAFT_HOST=your-server-ip
MINECRAFT_PORT=25565
```

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - see LICENSE file for details.
