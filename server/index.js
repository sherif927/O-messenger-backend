//Importing Application Configuration
require('./config/config');

//Primary Imports
const express = require('express');
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

//TEST method
app.get('/', (req, res) => {
  res.status(200).send({ message: 'welcome' });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = { app }