const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.makeSketchListNamePropView =
 functions.database.ref('/users/{userID}/sketches/{sketchID}/info').onWrite(event => {
   const original = event.data.val();
   let newPath = "/viewSketchList/users/" + event.params.userID + "/sketches/" + event.params.sketchID + "/info";
   console.log("ivar and tom are the king of functions");
   admin.database().ref(newPath).set(original);
 });

//create on the client side a firebase-I-shall-say-this-only-once wc,
//that connects to a path "/systemToClient/users/" + user.userID + "/systemMessage/", and every time a new entry is made,
//it reads that entry out to the user, and then after it has downloaded it, it deletes it from the datastore.
// exports.sendWelcomeMessage = functions.auth.user().onCreate(event => {
//   const user = event.data;
//   let newPath = "/systemToClient/users/" + user.userID + "/systemMessage/";
//   console.log("How are the plans for moving to Lviv going? :)");
//   admin.database().ref(newPath).push({msg: "Welcome to Robotpad and the drawing of petals!", timeStamp: new Date()});
// });
//      _newUser(e) { //todo this we want to do as a firebase cloud function
//        this.$.serverUserSnap.updateOverwrite({
//          registered: firebase.database.ServerValue.TIMESTAMP
//        });
//        this._fire("system-message", "Welcome new user!");
//      }