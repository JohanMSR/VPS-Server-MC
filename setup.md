# Setup Instructions

## Prerequisites

Before setting up the Minecraft server, ensure you have the following installed:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Git** (for version control)
- **Node.js** (version 18 or higher, for dashboard development)

## Quick Setup

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd Anomaly-sv
```

### 2. Start the Server
```bash
docker-compose up -d
```

### 3. Access Dashboard
Open your browser and navigate to: http://localhost:6060

## Detailed Setup

### Server Configuration

The Minecraft server is configured with:
- **Minecraft Version**: 1.20.1
- **Forge Version**: 47.4.0
- **Port**: 25565
- **Max Players**: 20
- **Gamemode**: Survival
- **Difficulty**: Normal

### Dashboard Features

The administrative dashboard includes:
- **Real-time server monitoring**
- **Player management**
- **Server console access**
- **Log viewing**
- **Performance metrics**
- **Command execution**

### File Structure

```
Anomaly-sv/
├── server/                 # Minecraft server files
│   ├── mods/              # Forge mods
│   ├── config/            # Server configuration
│   ├── logs/              # Server logs
│   ├── world/             # World data
│   ├── server.properties  # Server settings
│   ├── eula.txt          # EULA agreement
│   └── run.sh            # Server startup script
├── dashboard/             # Administrative dashboard
│   ├── public/           # Web interface
│   ├── config/           # Dashboard settings
│   ├── server.js        # Dashboard server
│   └── package.json     # Node.js dependencies
├── docker-compose.yml    # Docker orchestration
├── Dockerfile           # Server container
└── README.md           # Documentation
```

## Management Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Minecraft server only
docker-compose logs -f minecraft

# Dashboard only
docker-compose logs -f dashboard
```

### Restart Services
```bash
docker-compose restart
```

### Update Services
```bash
docker-compose pull
docker-compose up -d
```

## Server Management

### Adding Mods
1. Place mod files in `server/mods/`
2. Restart the server: `docker-compose restart minecraft`

### Configuration Changes
1. Edit `server/server.properties`
2. Restart the server: `docker-compose restart minecraft`

### World Management
- World files are stored in `server/world/`
- Backup by copying the world directory
- Restore by replacing the world directory

## Troubleshooting

### Common Issues

**Server won't start:**
- Check Docker is running
- Verify port 25565 is available
- Check logs: `docker-compose logs minecraft`

**Dashboard not accessible:**
- Verify port 6060 is available
- Check dashboard logs: `docker-compose logs dashboard`
- Ensure Node.js dependencies are installed

**Performance issues:**
- Increase memory allocation in `server/run.sh`
- Check system resources
- Monitor server logs for errors

### Log Locations
- Server logs: `server/logs/latest.log`
- Docker logs: `docker-compose logs`
- Dashboard logs: Available in dashboard interface

## Security Notes

- Change default passwords
- Configure firewall rules
- Regular backups recommended
- Monitor server logs for suspicious activity

## Support

For issues and support:
1. Check the logs first
2. Verify all prerequisites are met
3. Ensure ports are not blocked
4. Check Docker and Docker Compose versions
