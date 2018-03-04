const express = require('express');
const User=require('../models/user');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const {authenticate}=require('../middleware/authentication/authenticate');
var router=express.Router();

router.get('/',async (req,res)=>{
    res.status(200).send({message:'welcome to users'});
});

router.post('/signup',async (req,res)=>{
    try {
        var body=_.pick(req.body,['email','username','password','fcm_token','displayPicture']);
        var user = new User(body);
        await user.save();
        var token = await user.generateAuthToken();
        res.header('x-auth', token).status(200).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});


router.post('/login',async (req,res)=>{
    try {
        var body = _.pick(req.body, ['email', 'password']);
        var user = await User.findByCredentials(body.email, body.password);
        var token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.put('/logout',authenticate,async(req,res)=>{
    try {
        await req.user.removeToken(req.token);
        res.status(200).send({ message: 'Logout Successful' });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/friends',authenticate,async (req,res)=>{
    try{
        res.status(200).send(req.user.friends);
    }catch(e){
        res.status(400).send(e);
    }
});

router.get('/requests',authenticate,async (req,res)=>{
    try{
        res.status(200).send(req.user.requests);
    }catch(e){
        res.status(400).send(e);
    }
});


router.delete('/rejectFriend',authenticate,async (req,res)=>{
   try{
    var user=req.user;
    var body=_.pick(req.body,['userId']);
    var result=await User.rejectRequest(user._id,body.userId);
    res.status(200).send(result);
   }catch(e){
    res.status(400).send(e);
   }
});


module.exports=router;