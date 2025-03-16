const express = require('express');
const { addEmotion, getUserEmotions, getLastEmotion } = require('../controllers/emotions.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', authMiddleware, addEmotion); // Agregar emoción
router.get('/', authMiddleware, getUserEmotions); // Obtener historial de emociones
router.get('/last', authMiddleware, getLastEmotion); // Última emoción registrada

module.exports = router;
