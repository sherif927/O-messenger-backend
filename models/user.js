const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    }, email: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
        unique: true,
        validate: {
            isAsync: true,
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email.'
        }
    }, password: {
        type: String,
        required: true,
        minLength: 6
    }, auth_token: {
        type: String,
        required: true
    }, fcm_token: {
        type: String,
        required: true
    }, displayPicture: {
        type: String
    }, statusUpdate:{
        type: String
    },friends: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }, username: {
            type: String,
            required: true,
            minLength: 1,
            trim: true
        }, email: {
            type: String,
            required: true,
            minLength: 1,
            trim: true
        }, picture: {
            type: String
        }
    }],requests: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }, username: {
            type: String,
            required: true,
            minLength: 1,
            trim: true
        }, email: {
            type: String,
            required: true,
            minLength: 1,
            trim: true
        }, picture: {
            type: String
        }
    }]
});


var User = mongoose.model('User', UserSchema);

module.exports = User;