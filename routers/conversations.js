const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');
const Conversation = require('../models/conversation');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const authenticate = require('../middleware/authentication/authenticate');
var router = express.Router();

router.post('/newConversation', async (req, res) => {
  try {
    var body = _.pick(req.body, ['users']);
    console.log(body.users);
    var conversation = new Conversation({ users: body.users });
    await conversation.save();
    res.status(200).send(conversation);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/chatMessages/:id', async (req, res) => {
  if(ObjectID.isValid(req.params.id)){
  try {
    var id = req.params.id;
    var conversation = await Conversation.findOne({ _id: new ObjectID(id) })
    res.status(200).send(conversation.messages);
  } catch (err) {
    res.status(400).send(err);
  }
} else res.status(400).send({message:'Invalid ObjectId'});
});

router.get('/userChats/:id', async (req, res) => {
  if(ObjectID.isValid(req.params.id)){
    try {
      var id = new ObjectID(req.params.id);
      var conversations = await Conversation.find({ 'users.userId': id }); 
      res.status(200).send(conversations);
    } catch (err) {
      res.status(400).send(err);
    }
  } else res.status(400).send({message:'Invalid ObjectId'});
});

module.exports = router;