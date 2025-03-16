const Message = require('../models/message.model');

const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    const userId = req.user.id;

    if (!question) {
      return res.status(400).json({ message: 'Falta la pregunta' });
    }

    await Message.create(userId, question);
    res.status(201).json({question});
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
