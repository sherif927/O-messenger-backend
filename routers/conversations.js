const express = require('express');
const User = require('../models/user');
const Conversation = require('../models/conversation');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const authenticate = require('../middleware/authentication/authenticate');
var router = express.Router();

router.post('/newConversation',authenticate,async(req,res)=>{
  try {
    var body = _.pick(req.body, ['users']);
    var conversation=new Conversation({ users:body });
    await conversation.save();
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;