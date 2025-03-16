const express = require('express');
const { askQuestion, answerQuestion, getUserMessages } = require('../controllers/messages.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', authMiddleware, askQuestion); // Enviar pregunta
router.post('/answer', authMiddleware, answerQuestion); // Responder pregunta
router.get('/', authMiddleware, getUserMessages); // Ver mensajes

module.exports = router;
