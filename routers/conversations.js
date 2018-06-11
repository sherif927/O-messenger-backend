const express = require('express');
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
    console.log(body);
    var conversation = new Conversation({ users: body.users });
    await conversation.save();
    res.status(200).send(conversation);
  } catch (e) {
    res.status(400).send(e);
    console.log(e);
  }
});

module.exports = router;