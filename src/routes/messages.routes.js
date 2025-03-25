const express = require('express');
const { askQuestion, answerQuestion, getUserMessages, getAllMessages } = require('../controllers/messages.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', authMiddleware, askQuestion); // Enviar pregunta
router.post('/answer', authMiddleware, answerQuestion); // Responder pregunta
router.get('/all', authMiddleware ,getAllMessages); // Ver mensajes
router.get('/', authMiddleware, getUserMessages); // Ver mensaje

module.exports = router;