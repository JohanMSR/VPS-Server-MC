// Minecraft Dashboard JavaScript
class MinecraftDashboard {
    constructor() {
        this.socket = io();
        this.initializeEventListeners();
        this.initializeSocketListeners();
        this.loadServerStatus();
        this.loadLogs();
    }

    initializeEventListeners() {
        // Console input
        const consoleInput = document.getElementById('consoleInput');
        const sendCommand = document.getElementById('sendCommand');
        
        sendCommand.addEventListener('click', () => this.sendCommand());
        consoleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendCommand();
            }
        });

        // Refresh logs
        document.getElementById('refreshLogs').addEventListener('click', () => {
            this.loadLogs();
        });
    }

    initializeSocketListeners() {
        this.socket.on('server-status', (status) => {
            this.updateServerStatus(status);
        });

        this.socket.on('server-command', (command) => {
            this.addConsoleMessage(`> ${command}`);
        });
    }

    async loadServerStatus() {
        try {
            const response = await fetch('/api/status');
            const status = await response.json();
            this.updateServerStatus(status);
        } catch (error) {
            console.error('Failed to load server status:', error);
        }
    }

    async loadLogs() {
        try {
            const response = await fetch('/api/logs');
            const data = await response.json();
            this.updateLogs(data.logs);
        } catch (error) {
            console.error('Failed to load logs:', error);
        }
    }

    updateServerStatus(status) {
        // Update status indicator
        const statusIndicator = document.getElementById('statusIndicator');
        const statusDot = statusIndicator.querySelector('.status-dot');
        const statusText = document.getElementById('statusText');
        
        if (status.running) {
            statusDot.classList.add('online');
            statusText.textContent = 'Online';
        } else {
            statusDot.classList.remove('online');
            statusText.textContent = 'Offline';
        }

        // Update server status card
        document.getElementById('serverStatus').textContent = status.running ? 'Online' : 'Offline';
        document.getElementById('playerCount').textContent = `${status.players.length}/${status.maxPlayers || 20}`;
        document.getElementById('uptime').textContent = this.formatUptime(status.uptime);
        document.getElementById('tps').textContent = status.tps.toFixed(1);
        
        // Update memory
        const memoryUsed = status.memory.used;
        const memoryMax = status.memory.max;
        const memoryPercent = (memoryUsed / memoryMax) * 100;
        document.getElementById('memory').textContent = `${memoryUsed}/${memoryMax} MB`;
        document.getElementById('memoryProgress').style.width = `${memoryPercent}%`;

        // Update players list
        this.updatePlayersList(status.players);
    }

    updatePlayersList(players) {
        const playersList = document.getElementById('playersList');
        
        if (players.length === 0) {
            playersList.innerHTML = '<p class="no-players">No players online</p>';
            return;
        }

        const playersHTML = players.map(player => `
            <div class="player-item">
                <div class="player-avatar">${player.name.charAt(0).toUpperCase()}</div>
                <span>${player.name}</span>
            </div>
        `).join('');

        playersList.innerHTML = playersHTML;
    }

    updateLogs(logs) {
        const logsOutput = document.getElementById('logsOutput');
        logsOutput.textContent = logs.join('\n');
        logsOutput.scrollTop = logsOutput.scrollHeight;
    }

    async sendCommand() {
        const input = document.getElementById('consoleInput');
        const command = input.value.trim();
        
        if (!command) return;

        // Add to console output
        this.addConsoleMessage(`> ${command}`);
        input.value = '';

        try {
            const response = await fetch('/api/command', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ command })
            });

            const result = await response.json();
            if (result.success) {
                this.addConsoleMessage(`Command sent: ${command}`);
            } else {
                this.addConsoleMessage(`Error: ${result.error}`);
            }
        } catch (error) {
            this.addConsoleMessage(`Error sending command: ${error.message}`);
        }
    }

    addConsoleMessage(message) {
        const consoleOutput = document.getElementById('consoleOutput');
        const timestamp = new Date().toLocaleTimeString();
        consoleOutput.textContent += `[${timestamp}] ${message}\n`;
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    formatUptime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MinecraftDashboard();
});
