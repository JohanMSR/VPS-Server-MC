FROM openjdk:17-jdk-slim

# Install necessary packages
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Create server directory
WORKDIR /data

# Download and install Forge 47.4.0 for Minecraft 1.20.1
RUN wget -O forge-installer.jar https://maven.minecraftforge.net/net/minecraftforge/forge/1.20.1-47.4.0/forge-1.20.1-47.4.0-installer.jar

# Install Forge server
RUN java -jar forge-installer.jar --installServer

# Clean up installer
RUN rm forge-installer.jar

# Create necessary directories
RUN mkdir -p /data/mods /data/config /data/logs /data/world

# Copy server files if they exist
COPY server/ /data/

# Create default run.sh if it doesn't exist
RUN if [ ! -f /data/run.sh ]; then \
        echo '#!/usr/bin/env sh' > /data/run.sh && \
        echo '# Forge requires a configured set of both JVM and program arguments.' >> /data/run.sh && \
        echo '# Add custom JVM arguments to the user_jvm_args.txt' >> /data/run.sh && \
        echo '# Add custom program arguments {such as nogui} to this file in the next line before the "$@" or' >> /data/run.sh && \
        echo '#  pass them to this script directly' >> /data/run.sh && \
        echo 'java @user_jvm_args.txt @libraries/net/minecraftforge/forge/1.20.1-47.4.0/unix_args.txt "$@"' >> /data/run.sh; \
    fi

# Set permissions
RUN chmod +x /data/run.sh

# Create default server.properties if it doesn't exist
RUN if [ ! -f /data/server.properties ]; then \
        echo 'server-name=Anomaly SV' > /data/server.properties && \
        echo 'server-port=25565' >> /data/server.properties && \
        echo 'max-players=20' >> /data/server.properties && \
        echo 'difficulty=normal' >> /data/server.properties && \
        echo 'gamemode=survival' >> /data/server.properties && \
        echo 'motd=Welcome to Anomaly SV!' >> /data/server.properties && \
        echo 'online-mode=true' >> /data/server.properties && \
        echo 'white-list=false' >> /data/server.properties; \
    fi

# Create EULA if it doesn't exist
RUN if [ ! -f /data/eula.txt ]; then \
        echo '#By changing the setting below to TRUE you are indicating your agreement to our EULA (https://aka.ms/MinecraftEULA).' > /data/eula.txt && \
        echo '#Tue Jan 01 00:00:00 UTC 2024' >> /data/eula.txt && \
        echo 'eula=true' >> /data/eula.txt; \
    fi

# Expose port
EXPOSE 25565

# Start server
CMD ["/data/run.sh"]
