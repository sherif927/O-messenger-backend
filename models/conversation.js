const mongoose = require('mongoose');

var ConversationSchema = new mongoose.Schema({
    users: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },username:{
            type:String,
            required:true
        },email:{
            type:String,
            required:true
        },picture:{
            type:String
        }
    }]
});

var Conversation = mongoose.model('conversation', ConversationSchema);
module.exports = Conversation;