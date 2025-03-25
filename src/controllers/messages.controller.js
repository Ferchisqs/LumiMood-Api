// messages.controller.js
const Message = require('../models/message.model');
const User = require('../models/user.model');
const admin = require('../config/firebase-config'); // Asegúrate de que esta ruta sea correcta
const db = require('../config/db');

const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    const userId = req.user.id;

    if (!question) {
      return res.status(400).json({ message: 'Falta la pregunta' });
    }

    // Guardar la pregunta en la base de datos
    const messageId = await Message.create(userId, question);

    // Obtener el token FCM de los usuarios para enviar la notificación
    const tokens = await User.getAllTokens();
    console.log('Tokens:', tokens);
    
    if (tokens.length > 0) {
      const validTokens = tokens.filter(token => token); // Filtrar tokens nulos o vacíos
      
      // Crea el mensaje de notificación
      const payload = {
        notification: {
          title: 'Nueva Pregunta',
          body: `Usuario con ID ${userId} ha realizado una nueva pregunta: "${question}"`,
        }
      };

      // Usar envío por lotes en lugar de multicast
      try {
        const batchResponse = await sendNotificationsToBatch(validTokens, payload);
        console.log(`Notificaciones enviadas: ${batchResponse.successCount}`);
        
        // Procesar tokens inválidos
        if (batchResponse.failedTokens.length > 0) {
          console.log('Tokens inválidos:', batchResponse.failedTokens);
          // Remover tokens inválidos de la base de datos
          for (const token of batchResponse.failedTokens) {
            await removeInvalidToken(token);
          }
        }
      } catch (error) {
        console.error('Error al enviar notificaciones:', error);
      }
    }

    res.status(201).json({ messageId, question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// Función para enviar notificaciones por lotes y manejar errores
async function sendNotificationsToBatch(tokens, payload) {
  const results = {
    successCount: 0,
    failureCount: 0,
    failedTokens: []
  };
  
  const promises = tokens.map(async (token) => {
    try {
      await admin.messaging().send({
        ...payload,
        token: token
      });
      results.successCount++;
      return { success: true, token };
    } catch (error) {
      results.failureCount++;
      results.failedTokens.push(token);
      return { success: false, token, error };
    }
  });
  
  await Promise.allSettled(promises);
  return results;
}

// Función para eliminar tokens inválidos
async function removeInvalidToken(token) {
  try {
    // Implementa esta función para actualizar la base de datos
    await db.execute('UPDATE users SET fcmToken = NULL WHERE fcmToken = ?', [token]);
    console.log(`Token inválido eliminado: ${token}`);
  } catch (error) {
    console.error('Error al eliminar token inválido:', error);
  }
}

const answerQuestion = async (req, res) => {
  try {
    const { messageId, response } = req.body;

    if (!messageId || !response) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    await Message.respond(messageId, response);
    res.json({ messageId, response });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.getAll();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
}

const getUserMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message.getByUser(userId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

module.exports = { askQuestion, answerQuestion, getUserMessages, getAllMessages };
