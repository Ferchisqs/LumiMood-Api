// firebase-config.js
const admin = require('firebase-admin');
const serviceAccount = require('../path/to/woven-patrol-451919-m8-firebase-adminsdk-fbsvc-624aac6bb9.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
