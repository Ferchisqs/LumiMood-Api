// firebase-config.js
const admin = require('firebase-admin');

// Inicializa Firebase Admin con las credenciales
const serviceAccount = require('../../woven-patrol-451919-m8-firebase-adminsdk-fbsvc-624aac6bb9.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;