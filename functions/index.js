const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.makeSketchListNamePropView =
 functions.database.ref('/users/{userID}/sketches/{sketchID}/info').onWrite(event => {
   const original = event.data.val();
   let newPath = "/viewSketchList/users/" + event.params.userID + "/sketches/" + event.params.sketchID + "/info";
   console.log("ivar is the king of functions");
   admin.database().ref(newPath).set(original);
  //  return event.data.ref.root.ref(newPath).set(original);
 });