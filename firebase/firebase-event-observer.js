var admin = require("firebase-admin");
var events = require('events');
var firebaseEmitter = new events.EventEmitter();
var serviceAccount = require("./o-messenger-backend-firebase-adminsdk-llbsk-bef6522eef.json");

//Initialize admin-sdk with credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://o-messenger-backend.firebaseio.com"
});

emitter.on('push-notification', async function (messageData) {
    //Setting the notification body and title
    var payload = {
        notification: {
            title: messageData.title,
            body: messageData.body
        }
    };

    // This registration token comes from the client FCM SDKs.
    var registrationTokens = messageData.registrationTokens;

    // Set the message as high priority and have it expire after 24 hours.
    var options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };

    // Send a message to the devices corresponding to the provided
    // registration tokens with the provided options.
    try {
        var response = await admin.messaging().sendToDevice(registrationTokens, payload, options);
        console.log(response);
    } catch (e) {
        console.log(e);
    }
});

module.exports = firebaseEmitter;