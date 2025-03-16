const Recommendation = require('../models/recommendation.model');

const addRecommendation = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    const recommendationId = await Recommendation.create(title, description);
    res.status(201).json({ message: 'Recomendación agregada', recommendationId });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

const getAllRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.getAll();
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

const getRecommendationById = async (req, res) => {
  try {
    const { id } = req.params;
    const recommendation = await Recommendation.getById(id);

    if (!recommendation) {
      return res.status(404).json({ message: 'Recomendación no encontrada' });
    }

    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

module.exports = { addRecommendation, getAllRecommendations, getRecommendationById };
