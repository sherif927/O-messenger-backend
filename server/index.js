//Importing Application Configuration
require('./config/config');

//Primary Imports
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParse = require('body-parser');

//Import Routers
var users = require('../routers/users');
var conversations = require('../routers/conversations');
var friends=require('../routers/friends');

//DB and ODM Config
const mongoose = require('../db/mongoose');

//Initializing Express
var app = express();

//Setting the PORT variable according to the running enviroment
const port = process.env.PORT;

//Middleware and Routers
app.use(bodyParse.json());
app.use('/users', users);
app.use('/conversations', conversations);
app.use('/friends',friends);

//Initializing SocketIO
var server = http.createServer(app);
var io = socketIO(server);

//TEST method
app.get('/', (req, res) => {
  res.status(200).send({ message: 'welcome' });
});

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('disconnect', () => {
    console.log('User Disconnected');
  });
});

server.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = { app }

