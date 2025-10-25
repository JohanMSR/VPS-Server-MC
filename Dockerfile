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

# Create default server files
RUN echo '#!/usr/bin/env sh' > /data/run.sh && \
    echo '# Forge requires a configured set of both JVM and program arguments.' >> /data/run.sh && \
    echo '# Add custom JVM arguments to the user_jvm_args.txt' >> /data/run.sh && \
    echo '# Add custom program arguments {such as nogui} to this file in the next line before the "$@" or' >> /data/run.sh && \
    echo '#  pass them to this script directly' >> /data/run.sh && \
    echo 'java @user_jvm_args.txt @libraries/net/minecraftforge/forge/1.20.1-47.4.0/unix_args.txt "$@"' >> /data/run.sh

# Set permissions
RUN chmod +x /data/run.sh

# Expose port
EXPOSE 25565

# Start server
CMD ["/data/run.sh"]
