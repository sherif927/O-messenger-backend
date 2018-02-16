//Express and Json Body Parser imports
const express = require('express');
const bodyParse = require('body-parser');

//Import Routers
var users=require('../routers/users');
var messages=require('../routers/messages');

//Initializing Express
var app = express();

const port = process.env.PORT || 3000;

//Middleware and Routers
app.use(bodyParse.json());
app.use('/users',users);
app.use('/messages',messages);

//TEST method
app.get('/', (req, res) => {
    res.status(200).send({ message: 'welcome' });
})

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = { app }

