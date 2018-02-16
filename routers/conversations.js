const express = require('express');
const Conversation=require('../models/conversation');
const Message=require('../models/message');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
var router=express.Router();

router.get('/',async (req,res)=>{
    res.status(200).send({message:'welcome to conversations'});
});

router.post('/',async (req,res)=>{
    var body=_.pick(req.body,['users']);
    var conv=new Conversation(body);
    try{
        var conversation=await conv.save();
        res.status(200).send(conversation);
    }catch(e){
        res.status(400).send(e);
    }
});

router.post('/msg',async (req,res)=>{
    var body=_.pick(req.body,['sentFrom','conversationId','payload','status','type']);
    var msg=new Message(body);
    console.log(msg);
    try{
        var message=await msg.save();
        res.status(200).send(message);
    }catch(e){
        res.status(400).send(e);
    }
});

module.exports=router;