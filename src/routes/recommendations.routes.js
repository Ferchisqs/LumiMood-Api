const express = require('express');
const { addRecommendation, getAllRecommendations, getRecommendationById } = require('../controllers/recommendations.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Rutas para recomendaciones
router.post('/', authMiddleware, addRecommendation);  // Crear recomendación
router.get('/', getAllRecommendations);  // Obtener todas las recomendaciones
router.get('/:id', getRecommendationById);  // Obtener recomendación por ID

module.exports = router;
