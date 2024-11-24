#!/usr/bin/env node

// Import required modules
const app = require('./app'); // Import the Express app
const http = require('http'); // Built-in HTTP module to create the server
const debug = require('debug')('express:server'); // Debugging tool for logging

// Normalize the port into a number, string, or false
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val; // Named pipe
  }

  if (port >= 0) {
    return port; // Valid port number
  }

  return false; // Invalid port
}


// Get the port from environment or use 3000 by default
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Create HTTP server and pass the Express app as the handler
const server = http.createServer(app);

// Listen on the specified port, and set up event listeners for errors and listening
server.listen(port);
server.on('error', onError); // Listen for errors
server.on('listening', onListening); // Listen when the server starts

// Event listener for server "listening" event
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);

  // Add the log to indicate the server is running
  console.log(`Server is running on http://localhost:${port}`);
}

// Event listener for server "error" event
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // Handle specific listen errors with appropriate messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
