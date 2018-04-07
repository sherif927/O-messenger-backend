const express = require('express');
const User = require('../models/user');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const authenticate = require('../middleware/authentication/authenticate');
var router = express.Router();

router.get('/', authenticate, async (req, res) => {
    res.status(200).send(req.user.friends);
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
    console.log(body);
    if (!ObjectID.isValid(body.userId)) return res.status(400).send({message: 'Invalid Id'});
    var result = await User.approveRequest(req.user, body.userId);
    res.status(200).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/search',authenticate,async(req,res)=>{
  try {
    var body = _.pick(req.body, ['username']);
    var result = await User.searchByUsername(req.user._id,body.username);
    (result == null) ?
      res.status(404).send({ message: 'Object was not found' }) :
      res.status(200).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/removeFriend',authenticate,async (req,res)=>{
  try {
    var user = req.user;
    var body = _.pick(req.body, ['userId']);
    if (!ObjectID.isValid(body.userId)) return res.status(400).send({message: 'Invalid Id'});
    var result = await User.removeFriend(user._id, body.userId);
    (result == null) ?
      res.status(404).send({ message: 'Object was not found' }) :
      res.status(200).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put('/addFriend', authenticate, async (req, res) => {
  try {
    var body = _.pick(req.body, ['userId']);
    if (!ObjectID.isValid(body.userId)) return res.status(400).send({message: 'Invalid Id'});
    var result = await User.addFriend(req.user, body.userId);
    (result == null) ?
      res.status(404).send({ message: 'Object was not found' }) :
      res.status(200).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;