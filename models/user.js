const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const { ObjectID } = require('mongodb');
var ObjectId = require('mongoose').Types.ObjectId;

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
  }, fcm_token: {
    type: String,
    required: true
  }, displayPicture: {
    type: String
  }, statusUpdate: {
    type: String
  }, friends: [{
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
    }, displayPicture: {
      type: String
    }
  }], requests: [{
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
    }, displayPicture: {
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

UserSchema.statics.searchByUsername = async function (userId, username) {
  var User = this;
  return User.find({ _id: { $ne: new ObjectID(userId) }, username: { $regex: '.*' + username + '.*' } });
}

UserSchema.statics.addFriend = async function (user, userId) {
  var User = this;
  var userToAdd = await User.findOne({ _id: new ObjectID(userId) });
  var foundInRequests = false, foundInFriends = false;

  for (i = 0; i < userToAdd.friends.length; i++) {
    if (userToAdd.friends[i].email == user.email) {
      foundInFriends = true;
      break;
    }
  }

  for (i = 0; i < userToAdd.requests.length; i++) {
    if (userToAdd.requests[i].email == user.email) {
      foundInRequests = true;
      break;
    }
  }

  for (i = 0; i < user.friends.length; i++) {
    if (user.friends[i].email == userToAdd.email) {
      foundInFriends = true;
      break;
    }
  }

  for (i = 0; i < user.requests.length; i++) {
    if (user.requests[i].email == userToAdd.email) {
      foundInRequests = true;
      break;
    }
  }

  if (!foundInFriends && !foundInRequests) {
    var userSummary = {
      userId: new ObjectID(user._id),
      username: user.username,
      email: user.email,
      displayPicture: user.displayPicture
    }

    userToAdd.requests.push(userSummary);
    return userToAdd.save();
  }
  var message;
  if (foundInFriends && !foundInRequests)
    message = { message: 'You are already friends with this user' };
  else if (!foundInFriends && foundInRequests)
    message = { message: 'You have already sent a friend request to this user' };
  else
    message = { message: 'You cannot add this user' };
  return Promise.reject(message);
}

UserSchema.statics.rejectRequest = function (userId, rejectedId) {
  var User = this;
  return User.findOneAndUpdate({
    _id: new ObjectID(userId)
  }, {
      $pull: {
        requests: {
          userId: rejectedId
        }
      }
    }, {
      returnOriginal: true
    });
}

UserSchema.statics.removeFriend = async function (userId, removedId) {
  var User = this;
   var removal=await User.findOneAndUpdate({
    _id: new ObjectID(removedId)
  }, {
      $pull: {
        friends: {
          userId: userId
        }
      }
    }, {
      returnOriginal: true
    });

    return User.findOneAndUpdate({
      _id: new ObjectID(userId)
    }, {
        $pull: {
          friends: {
            userId: removedId
          }
        }
      }, {
        returnOriginal: true
      });
}

UserSchema.statics.approveRequest = async function (user, approvedId) {
  var User = this;
  var approvedUser = await User.findOne({ _id: new ObjectID(approvedId) });

  var minifiedUser = {
    userId: user._id,
    username: user.username,
    email: user.email,
    displayPicutre: user.displayPicture
  };

  var minifiedUser2 = {
    userId: approvedUser._id,
    username: approvedUser.username,
    email: approvedUser.email,
    displayPicture: approvedUser.displayPicture
  };

  try {
    var res1 = await User.findOneAndUpdate({
      _id: new ObjectID(user._id)
    }, {
        $pull: {
          requests: {
            userId: new ObjectID(approvedId)
          }
        }
      }, {
        returnOriginal: true
      });
  } catch (e) {
    return Promise.reject();
  }
  user.friends.push(minifiedUser2);
  approvedUser.friends.push(minifiedUser);
  var res1 = await user.save();
  var res2 = await approvedUser.save();
  return new Promise((resolve, reject) => {
    (res1 && res2) ? resolve({message:'Friend added'}) : reject();
  });
}



/////////////////////////////////////////////////
////////////// INSTANCE METHODS /////////////////
/////////////////////////////////////////////////

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var token = jwt.sign({ _id: user._id.toHexString() }, 'abc123').toString();

  user.auth_token = token;

  return user.save().then(() => {
    return token;
  });
}

UserSchema.methods.removeToken = function (token) {
  var user = this;
  user.auth_token = "";
  return user.save();
}

UserSchema.methods.updateProfile = function (profileUpdate) {
  var user = this;
  user.statusUpdate = profileUpdate.statusUpdate;
  user.displayPicture = profileUpdate.displayPicture;
  return user.save();
}

UserSchema.methods.toJSON = function () {
  var user = this;
  var obj = user.toObject();
  return _.pick(obj, ['_id', 'email', 'username', 'displayPicture', 'friends', 'requests', 'fcm_token']);
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