const admin = require('firebase-admin');

// Cargar credenciales de Firebase
const serviceAccount = require('../firebase-service-account.json'); // Descarga tu JSON desde Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const sendNotification = async (tokens, title, body) => {
  const message = {
    notification: { title, body },
    tokens
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log('Notificaciones enviadas:', response);
  } catch (error) {
    console.error('Error enviando notificación:', error);
  }
};

module.exports = { sendNotification };
