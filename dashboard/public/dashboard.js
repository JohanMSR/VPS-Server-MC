const { useState, useEffect } = React;
const { 
  ThemeProvider, 
  createTheme, 
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Box,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Paper,
  IconButton,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Tooltip
} = MaterialUI;

const {
  Dns,
  Memory,
  Group,
  Terminal,
  Refresh,
  Send,
  CheckCircle,
  Error,
  Warning
} = MaterialUIIcons;

// Create Material UI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

// Status Card Component
const StatusCard = ({ title, icon, children, color = 'primary' }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardHeader
      avatar={React.createElement(icon, { color: color, fontSize: 'large' })}
      title={title}
      sx={{ pb: 1 }}
    />
    <CardContent sx={{ flexGrow: 1 }}>
      {children}
    </CardContent>
  </Card>
);

// Server Status Component
const ServerStatusCard = ({ status }) => (
  <StatusCard title="Server Status" icon={Dns} color={status.running ? 'success' : 'error'}>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">Status:</Typography>
        <Chip 
          label={status.running ? 'Online' : 'Offline'} 
          color={status.running ? 'success' : 'error'}
          size="small"
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">Players:</Typography>
        <Typography variant="body1" fontWeight="bold">
          {status.players?.length || 0}/{status.maxPlayers || 20}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">Uptime:</Typography>
        <Typography variant="body1" fontWeight="bold">
          {formatUptime(status.uptime)}
        </Typography>
      </Box>
      {status.version && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">Version:</Typography>
          <Typography variant="body1" fontWeight="bold">{status.version}</Typography>
        </Box>
      )}
    </Box>
  </StatusCard>
);

// Performance Card Component
const PerformanceCard = ({ status }) => (
  <StatusCard title="Performance" icon={Memory} color="primary">
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">TPS:</Typography>
        <Typography variant="body1" fontWeight="bold" color={status.tps < 15 ? 'error.main' : 'success.main'}>
          {status.tps?.toFixed(1) || 'N/A'}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">Memory:</Typography>
        <Typography variant="body1" fontWeight="bold">
          {status.memory?.used || 0}/{status.memory?.max || 0} MB
        </Typography>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Memory Usage
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={status.memory?.max ? (status.memory.used / status.memory.max) * 100 : 0}
          color={status.memory?.max && (status.memory.used / status.memory.max) > 0.8 ? 'error' : 'primary'}
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          {status.memory?.max ? Math.round((status.memory.used / status.memory.max) * 100) : 0}%
        </Typography>
      </Box>
    </Box>
  </StatusCard>
);

// Players Card Component
const PlayersCard = ({ players }) => (
  <StatusCard title="Online Players" icon={Group} color="primary">
    {players && players.length > 0 ? (
      <List dense>
        {players.map((player, index) => (
          <ListItem key={index} sx={{ px: 0 }}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                {player.name?.charAt(0)?.toUpperCase() || '?'}
              </Avatar>
            </ListItemAvatar>
            <ListItemText 
              primary={player.name || 'Unknown Player'} 
              secondary={player.id ? `ID: ${player.id}` : ''}
            />
          </ListItem>
        ))}
      </List>
    ) : (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          No players online
        </Typography>
      </Box>
    )}
  </StatusCard>
);

// Console Component
const ConsoleCard = ({ onSendCommand, consoleOutput }) => {
  const [command, setCommand] = useState('');

  const handleSend = () => {
    if (command.trim()) {
      onSendCommand(command);
      setCommand('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        avatar={React.createElement(Terminal, { color: 'primary', fontSize: 'large' })}
        title="Server Console"
        sx={{ pb: 1 }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Paper 
          variant="outlined" 
          sx={{ 
            flexGrow: 1, 
            p: 2, 
            bgcolor: '#1e1e1e', 
            color: '#d4d4d4',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            overflow: 'auto',
            maxHeight: 300,
            whiteSpace: 'pre-wrap'
          }}
        >
          {consoleOutput || 'Console output will appear here...'}
        </Paper>
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter server command..."
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleSend}
            startIcon={React.createElement(Send)}
            disabled={!command.trim()}
          >
            Send
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [serverStatus, setServerStatus] = useState({
    running: false,
    players: [],
    maxPlayers: 20,
    uptime: 0,
    tps: 20,
    memory: { used: 0, max: 0 },
    version: '',
    motd: '',
    lastUpdate: new Date()
  });
  const [consoleOutput, setConsoleOutput] = useState('');
  const [logs, setLogs] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io();
    setSocket(newSocket);

    // Listen for server status updates
    newSocket.on('server-status', (status) => {
      setServerStatus(status);
      setLoading(false);
    });

    // Load initial data
    loadServerStatus();
    loadLogs();

    return () => newSocket.close();
  }, []);

  const loadServerStatus = async () => {
    try {
      const response = await fetch('/api/status');
      const status = await response.json();
      setServerStatus(status);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load server status:', error);
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    try {
      const response = await fetch('/api/logs');
      const data = await response.json();
      setLogs(data.logs.join('\n'));
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
  };

  const sendCommand = async (command) => {
    try {
      const response = await fetch('/api/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command })
      });

      const result = await response.json();
      const timestamp = new Date().toLocaleTimeString();
      
      if (result.success) {
        setConsoleOutput(prev => prev + `[${timestamp}] > ${command}\n`);
        setConsoleOutput(prev => prev + `[${timestamp}] Command sent successfully\n`);
      } else {
        setConsoleOutput(prev => prev + `[${timestamp}] Error: ${result.error}\n`);
      }
    } catch (error) {
      const timestamp = new Date().toLocaleTimeString();
      setConsoleOutput(prev => prev + `[${timestamp}] Error sending command: ${error.message}\n`);
    }
  };

  const formatUptime = (seconds) => {
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
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Dns sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Minecraft Server Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={serverStatus.running ? 'Online' : 'Offline'} 
              color={serverStatus.running ? 'success' : 'error'}
              size="small"
            />
            <Tooltip title="Last updated">
              <Typography variant="caption" color="inherit">
                {serverStatus.lastUpdate ? new Date(serverStatus.lastUpdate).toLocaleTimeString() : 'Never'}
              </Typography>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Server Status Cards */}
          <Grid item xs={12} md={4}>
            <ServerStatusCard status={serverStatus} />
          </Grid>
          <Grid item xs={12} md={4}>
            <PerformanceCard status={serverStatus} />
          </Grid>
          <Grid item xs={12} md={4}>
            <PlayersCard players={serverStatus.players} />
          </Grid>

          {/* Console */}
          <Grid item xs={12} md={6}>
            <ConsoleCard onSendCommand={sendCommand} consoleOutput={consoleOutput} />
          </Grid>

          {/* Server Logs */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardHeader
                avatar={React.createElement(Refresh, { color: 'primary', fontSize: 'large' })}
                title="Server Logs"
                action={
                  <IconButton onClick={loadLogs} size="small">
                    <Refresh />
                  </IconButton>
                }
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    height: 300, 
                    p: 2, 
                    bgcolor: '#f8f9fa', 
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {logs || 'No logs available'}
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

// Render the dashboard
ReactDOM.render(React.createElement(Dashboard), document.getElementById('root'));
