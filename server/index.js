require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');

const expressUtils = require('./expressUtils');

const indexRouter = require('./routes/index');

// Create Express instance
var app = express();

app.use(cors());

var server = http.createServer(app);

// Set port
var port = expressUtils.normalizePort(process.env.PORT || '80');
app.set('port', port);

// Handle server events
server.on('error', expressUtils.onError);
server.on('listening', () => expressUtils.onListening(server));

app.use('*', indexRouter);
server.listen(port);