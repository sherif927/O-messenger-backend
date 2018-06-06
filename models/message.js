const mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }, senderName: {
        type: String,
        required: true
    }, type: {
        type: Number,
        required: true,
    }, status: {
        type: Number,
        required: true
    }, payload: {
        type: String,
        required: true
    }, conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },sentAt:{
        type:Date,
        required:true
    }
});

module.exports = MessageSchema;