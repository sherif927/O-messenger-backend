const express = require('express');
const User = require('../models/user');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const { authenticate } = require('../middleware/authentication/authenticate');
var router = express.Router();

router.get('/friends', authenticate, async (req, res) => {
  try {
    res.status(200).send(req.user.friends);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/requests', authenticate, async (req, res) => {
  try {
    res.status(200).send(req.user.requests);
  } catch (e) {
    res.status(400).send(e);
  }
});


router.delete('/rejectFriend', authenticate, async (req, res) => {
  try {
    var user = req.user;
    var body = _.pick(req.body, ['userId']);
    if (!ObjectID.isValid(body.userId)) return res.status(400).send({message: 'Invalid Id'});
    var result = await User.rejectRequest(user._id, body.userId);
    (result == null) ?
      res.status(404).send({ message: 'Object was not found' }) :
      res.status(200).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put('/approveFriend', authenticate, async (req, res) => {
  try {
    var body = _.pick(req.body, ['userId']);
    if (!ObjectID.isValid(body.userId)) return res.status(400).send({message: 'Invalid Id'});
    var result = await User.approveRequest(req.user, body.userId);
    res.status(200).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put('/addFriend', authenticate, async (req, res) => {
  try {
    var user = {
      userId: req.user._id,
      username: req.user.username,
      email: req.user.email,
      displayPicture: req.user.displayPicture
    };
    var body = _.pick(req.body, ['userId']);
    if (!ObjectID.isValid(body.userId)) return res.status(400).send({message: 'Invalid Id'});
    var result = await User.addFriend(user, body.userId);
    (result == null) ?
      res.status(404).send({ message: 'Object was not found' }) :
      res.status(200).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;