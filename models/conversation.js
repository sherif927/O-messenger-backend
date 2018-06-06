const mongoose = require('mongoose');
const MessageSchema = require('./message');

var ConversationSchema = new mongoose.Schema({
    users: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }, username: {
            type: String,
            required: true
        }, email: {
            type: String,
            required: true
        }, picture: {
            type: String
        }, token: {
            type: String,
            required: true
        }
    }],
    messages: [
        MessageSchema
    ]
});

var Conversation = mongoose.model('conversation', ConversationSchema);
module.exports = Conversation;