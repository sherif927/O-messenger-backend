const express = require('express');
const User=require('../models/user');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
var router=express.Router();

router.get('/',async (req,res)=>{
    res.status(200).send({message:'welcome to users'});
});

router.post('/',async (req,res)=>{
    var body=_.pick(req.body,['email','username','password','auth_token','fcm_token','displayPicture','statusUpdate']);
    var user =new User(body);
    try{
        var userr=await user.save();
        res.status(200).send(userr);
    }catch(e){
        res.status(400).send(e);
    }
});

module.exports=router;