#!/bin/bash

# Setup script for VPS deployment
echo "Setting up Minecraft Forge Server on VPS..."

# Create server directory structure
mkdir -p server/{mods,config,logs,world}

# Create basic server.properties
cat > server/server.properties << 'EOF'
#Minecraft server properties
server-name=Anomaly SV
server-port=25565
max-players=20
difficulty=normal
gamemode=survival
motd=Welcome to Anomaly SV!
online-mode=true
white-list=false
enforce-whitelist=false
spawn-protection=16
max-world-size=29999984
level-name=world
level-seed=
level-type=minecraft:normal
generate-structures=true
generator-settings={}
allow-nether=true
pvp=true
enable-command-block=false
enable-query=false
enable-rcon=false
rcon.port=25575
rcon.password=
force-gamemode=false
rate-limit=0
hardcore=false
enable-status=true
broadcast-console-to-ops=true
enable-jmx-monitoring=false
sync-chunk-writes=true
enable-flight=false
broadcast-rcon-to-ops=true
view-distance=10
simulation-distance=10
server-ip=
network-compression-threshold=256
max-tick-time=60000
use-native-transport=true
enable-command-block=false
spawn-monsters=true
spawn-animals=true
spawn-npcs=true
function-permission-level=2
op-permission-level=4
player-idle-timeout=0
debug=false
EOF

# Create EULA file
cat > server/eula.txt << 'EOF'
#By changing the setting below to TRUE you are indicating your agreement to our EULA (https://aka.ms/MinecraftEULA).
#Tue Jan 01 00:00:00 UTC 2024
eula=true
EOF

echo "Server directory structure created successfully!"
echo "You can now run: docker-compose up -d"
