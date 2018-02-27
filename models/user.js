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

/////////////////////////////////////////////////
//////////////// MODEL METHODS //////////////////
/////////////////////////////////////////////////


UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }
    return User.findOne({
        '_id': decoded._id,
        'auth_token': token
    });

}

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;
    return User.findOne({ 'email': email }).then((user) => {
        if (!user)
            return Promise.reject();

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                (res) ? resolve(user) : reject();
            })
        });
    });
}


/////////////////////////////////////////////////
////////////// INSTANCE METHODS /////////////////
/////////////////////////////////////////////////

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var token = jwt.sign({ _id: user._id.toHexString()}, 'abc123').toString();

    user.auth_token=token;

    return user.save().then(() => {
        return token;
    });
}


UserSchema.methods.toJSON = function () {
    var user = this;
    var obj = user.toObject();
    return _.pick(obj, ['_id', 'email']);

}

UserSchema.methods.removeToken = function (token) {
    var user = this;
    user.auth_token="";
    return user.save();
}


/////////////////////////////////////////////////
////////////// PRE/POST METHODS /////////////////
/////////////////////////////////////////////////

UserSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        })
    } else {
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = User;