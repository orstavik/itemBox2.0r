const functions = require('firebase-functions');
<<<<<<< HEAD
const admin = require('firebase-admin');
const https = require('https');
const url = require('url');
const fs = require('fs');
const storage = require('@google-cloud/storage')();

admin.initializeApp(functions.config().firebase);

exports.makeHollowSketchList = functions.database.ref('/users/{userID}/sketches/{sketchID}/info')
  .onWrite(event => {
    const data = event.data.val();
    const ref = `/users/${event.params.userID}/__sketchesOnlyInfo/${event.params.sketchID}/info`;
    return admin.database().ref(ref).set(data);
  });

exports.setSketchCreatedTime = functions.database.ref('/users/{userID}/sketches/{sketchID}')
  .onCreate(event => {
    const ref = `/users/${event.params.userID}/sketches/${event.params.sketchID}/info/_created`;
    return admin.database().ref(ref).set(admin.database.ServerValue.TIMESTAMP);
  });

exports.BaDaS = functions.https
  .onRequest((request, response) => {
    const parsedUrl = parseUrl(request.url);
    if (parsedUrl) {
      const bucket = storage.bucket(functions.config().firebase.storageBucket);
      const bucketFile = bucket.file(parsedUrl.bucketPath);
      bucketFile.exists().then((exists) => {
        if (exists[0]) {
          response.writeHead(301, { Location: link });
          response.end();
        } else {
          const contentType = checkType(parsedUrl.file);
          response.writeHead(308, { 'Content-Type': contentType });
          https.get(parsedUrl.rawUrl, (res) => {
            let data = '';
            res.on('data', (chunk) => {
              data += chunk;
            }).on('end', () => {
              fs.mkdirSync('local', (err) => {});
              const filePath = __dirname + '/local/' + parsedUrl.file;
              fs.writeFileSync(filePath, data);
              bucket.upload(filePath, {
                destination: parsedUrl.bucketPath,
                public: true
              }, (result) => {
                response.writeHead(301, { Location: parsedUrl.bucketUrl });
                response.end();
                fs.unlinkSync(filePath);
                fs.rmdirSync('local');
              });
            });
          });
        }
      }).catch((err) => {
        throw new Error(err);
      });
    } else {
      response.end('Wrong Url!');
    }
  });

const parseUrl = (link) => {
  // https://gitlab.com/enlightenmentor/justDiary/raw/master/manifest.json
  // https://raw.githubusercontent.com/enlightenmentor/ultimate-shell/master/manifest.json
  // https://codepen.io/enlightenmentor/pen/prGRgd.js

  // /$service/$user/$project/$branch/$path
  const p = {};
  const parts = link.split('/').filter(part => !!part.length);
  p.user = parts[1];
  if (parts[0] === 'codepen') {
    p.base = 'https://codepen.io';
    p.project = parts[parts.length - 1].split('.')[0];
    p.file = parts[parts.length - 1];
    p.pathFile = parts[parts.length - 1];
    p.rawUrl = `${p.base}/${p.user}/pen/${p.file}`;
  } else {
    p.project = parts[2];
    p.file = parts[parts.length - 1];
    p.branch = parts[3];
    p.path = parts.slice(4, -1).join('/');
    p.pathFile = parts.slice(4).join('/');
    if (parts[0] === 'github') {
      p.base = 'https://raw.githubusercontent.com';
      p.rawUrl = `${p.base}/${p.user}/${p.project}/${p.branch}/${p.pathFile}`;
    } else if (parts[0] === 'gitlab') {
      p.base = 'https://gitlab.com';
      p.rawUrl = `${p.base}/${p.user}/${p.project}/raw/${p.branch}/${p.pathFile}`;
    }
  }
  p.bucketPath = `${parts[0]}/${p.user}/${p.project}/${p.branch}/${p.pathFile}`;
  p.bucketUrl = `https://storage.googleapis.com/${functions.config().firebase.storageBucket}/${p.pathFile}`;
  return p;
}

const checkType = (name) => {
  const ext = name.split('.').pop();
  switch (ext) {
    case 'css':
      return 'text/css';
    case 'html':
      return 'text/html';
    case 'js':
      return 'application/javascript';
    case 'json':
      return 'application/json';
  }
}
=======

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
>>>>>>> b4727142ba7dcc347c5fd6ce4faec1ac4585fbe0
