# Minecraft 1.20.1 Forge Server

A complete Minecraft 1.20.1 Forge server setup with Docker, Git, and an administrative dashboard.

## Features

- **Minecraft 1.20.1** with Forge 47.4.0
- **Docker** containerization for easy deployment
- **Git** version control
- **Administrative Dashboard** (MaterialUI) on port 6060
- **Complete folder structure** for server management

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd mimicer-sv
```

2. Start the server:
```bash
docker-compose up -d
```

3. Access the dashboard:
- Open http://localhost:6060 in your browser

## Server Management

### Starting the Server
```bash
docker-compose up -d minecraft
```

### Stopping the Server
```bash
docker-compose down
```

### Viewing Logs
```bash
docker-compose logs -f minecraft
```

### Dashboard Access
The administrative dashboard is available at http://localhost:6060

## Configuration

- Server properties: `server/server.properties`
- Forge mods: `server/mods/`
- World data: `server/world/`
- Dashboard config: `dashboard/config/`

## Requirements

- Docker
- Docker Compose
- Git
- Node.js (for dashboard development)

## Ports

- **Minecraft Server**: 25565
- **Dashboard**: 6060
