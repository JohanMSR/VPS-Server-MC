#!/bin/bash

echo "🚀 Installing Minecraft Server Dashboard..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Minecraft Server Configuration
MINECRAFT_HOST=localhost
MINECRAFT_PORT=25565

# Dashboard Configuration
PORT=6060
SERVER_PATH=/data/server

# Optional: Server Management
NODE_ENV=production
EOF
    echo "✅ Created .env file with default configuration"
fi

echo ""
echo "🎉 Installation complete!"
echo ""
echo "To start the dashboard:"
echo "  npm start"
echo ""
echo "To configure your Minecraft server:"
echo "  Edit the .env file with your server details"
echo ""
echo "Dashboard will be available at: http://localhost:6060"
