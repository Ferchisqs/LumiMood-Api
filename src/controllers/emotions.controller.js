const Emotion = require('../models/emotion.model');

const addEmotion = async (req, res) => {
  try {
    const { emotion, color } = req.body;
    const userId = req.user.id;

    if (!emotion || !color) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    const response = await Emotion.create( emotion, color);

    res.status(201).json({response});

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

const getUserEmotions = async (req, res) => {
  try {
    const userId = req.user.id;
    const emotions = await Emotion.getByUser(userId);
    res.json(emotions);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

const getLastEmotion = async (req, res) => {
  try {
    const userId = req.user.id;
    const lastEmotion = await Emotion.getLastEmotion(userId);
    res.json(lastEmotion);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

module.exports = { addEmotion, getUserEmotions, getLastEmotion };
