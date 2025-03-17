// messages.controller.js
const Message = require('../models/message.model');
const User = require('../models/user.model');
const admin = require('../config/firebase-config'); // Asegúrate de que esta ruta sea correcta

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

    if (tokens.length > 0) {
      const payload = {
        notification: {
          title: 'Nueva Pregunta',
          body: `Usuario con ID ${userId} ha realizado una nueva pregunta: "${question}"`,
        },
      };

      // Enviar la notificación a todos los tokens
      await admin.messaging().sendToDevice(tokens, payload);
    }

    res.status(201).json({ messageId, question });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};


const answerQuestion = async (req, res) => {
  try {
    const { messageId, response } = req.body;

    if (!messageId || !response) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    await Message.respond(messageId, response);
    res.json({messageId, response});
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

const getUserMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message.getByUser(userId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

module.exports = { askQuestion, answerQuestion, getUserMessages };
