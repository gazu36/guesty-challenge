require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');

const expressUtils = require('./expressUtils');

const indexRouter = require('./routes/index');
const definitionsRouter = require('./routes/definitions');

// Create Express instance
var app = express();

app.use(cors());
app.use(express.json());

var server = http.createServer(app);

// Set port
var port = expressUtils.normalizePort(process.env.PORT || '80');
app.set('port', port);

// Handle server events
server.on('error', expressUtils.onError);
server.on('listening', () => expressUtils.onListening(server));

app.use('/defs', definitionsRouter);
app.use('*', indexRouter);
server.listen(port);