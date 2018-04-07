//Importing Application Configuration
require('./config/config');

//Express and Json Body Parser imports
const express = require('express');
const bodyParse = require('body-parser');

//Import Routers
var users = require('../routers/users');
var conversations = require('../routers/conversations');
var friends=require('../routers/friends');

//DB and ORM Config
const mongoose = require('../db/mongoose');

//Initializing Express
var app = express();

var emitter=require('../firebase/firebase-event-observer');

//Setting the PORT variable according to the running enviroment
const port = process.env.PORT;

//Middleware and Routers
app.use(bodyParse.json());
app.use('/users', users);
app.use('/conversations', conversations);
app.use('/friends',friends);


//TEST method
app.get('/', (req, res) => {
  res.status(200).send({ message: 'welcome' });
})

app.get('/push', (req, res) => {
  emitter.emit('push-notification',{title:"test",body:"This is fcm testing",
  registrationTokens:['eB6Ge6sIE8g:APA91bFwRRBGJpK_odJA-gMTIq-n_fs5uIrbxMpZc8QsnknGzENmWThMnFMvqk33noL6lxMF7yW6PA3Q96wLWvhnUnhg2e9Y9Dexv54gVXuu1Xj8bYf9DwFRITw3mmmPYrmfVoksam9p']});
  
})

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = { app }

