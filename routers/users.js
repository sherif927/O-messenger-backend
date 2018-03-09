const express = require('express');
const User = require('../models/user');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const { authenticate } = require('../middleware/authentication/authenticate');
var router = express.Router();

router.get('/', async (req, res) => {
  res.status(200).send({ message: 'welcome to users' });
});

router.post('/signup', async (req, res) => {
  try {
    var body = _.pick(req.body, ['email', 'username', 'password', 'fcm_token', 'displayPicture']);
    var user = new User(body);
    await user.save();
    var token = await user.generateAuthToken();
    res.header('x-auth', token).status(200).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});


router.post('/login', async (req, res) => {
  try {
    var body = _.pick(req.body, ['email', 'password']);
    var user = await User.findByCredentials(body.email, body.password);
    var token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put('/logout', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send({ message: 'Logout Successful' });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put('/updateProfile', authenticate, async (req, res) => {
  try {
    var body = _.pick(req.body, ['statusUpdate', 'displayPicture']);
    var result = await req.user.updateProfile(body);
    res.status(200).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/me', authenticate, async (req, res) => {
  res.status(200).send(req.user);
});

router.get('/profile/:id', authenticate, async (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) return res.status(400).send({ message: 'Bad request,Invalid Id' });
  try{
    var result=await User.findOne({_id:new ObjectID(id)});
  (result == null) ?
      res.status(404).send({ message: 'Object was not found' }) :
      res.status(200).send(result);
  }catch(e){
      res.status(400).send(e);
  }
});

module.exports = router;
