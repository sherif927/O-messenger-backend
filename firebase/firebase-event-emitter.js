var firebaseEmitter=require('./firebase-event-observer');
var tokens = ["eB6Ge6sIE8g:APA91bFwRRBGJpK_odJA-gMTIq-n_fs5uIrbxMpZc8QsnknGzENmWThMnFMvqk33noL6lxMF7yW6PA3Q96wLWvhnUnhg2e9Y9Dexv54gVXuu1Xj8bYf9DwFRITw3mmmPYrmfVoksam9p",
"c1hmN81JcjA:APA91bHJEKf6RwMGJS-TwQ7S2_eG4q5BfFGhhxUMiRnSVP4lPG1mBCTVGRwosWsT6vJBFFh3W1RsB_FTttqSpSyX8hgnfEy3xf1jFEL-wbbBsXCCl853zF6puCQKDRsV8oEYLu3Y7e6G"];


firebaseEmitter.emit('push-notification',{
    title:'This is the title',
    body:'This is the body',
    registrationTokens:tokens
});