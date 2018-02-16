const express = require('express');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
var router=express.Router();

router.get('/',async (req,res)=>{
    res.status(200).send({message:'welcome to messages'});
});

module.exports=router;