const mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
    sentFrom: {
        type: mongoose.Schema.Types.ObjectId,
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
    }
});

var Message = mongoose.model('message', MessageSchema);
module.exports = Message;