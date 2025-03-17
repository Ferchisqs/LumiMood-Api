const admin = require('firebase-admin');

// Cargar credenciales de Firebase
const serviceAccount = require('../../woven-patrol-451919-m8-firebase-adminsdk-fbsvc-624aac6bb9.json'); // Asegúrate de que el archivo JSON tenga las credenciales correctas

// Inicializar Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const sendNotification = async (tokens, title, body) => {
  const message = {
    notification: { title, body }
  };

  try {
    // Enviar notificaciones a múltiples dispositivos usando sendToDevice
    const response = await admin.messaging().sendToDevice(tokens, message);
    console.log('Notificaciones enviadas:', response);
  } catch (error) {
    console.error('Error enviando notificación:', error);
  }
};

module.exports = { sendNotification };
