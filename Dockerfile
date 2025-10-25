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

# Copy server files
COPY server/ /data/

# Set permissions
RUN chmod +x /data/run.sh

# Expose port
EXPOSE 25565

# Start server
CMD ["/data/run.sh"]
