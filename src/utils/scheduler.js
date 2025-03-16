const cron = require('node-cron');
const User = require('../models/user.model');
const Emotion = require('../models/emotion.model');
const { sendNotification } = require('../config/firebase');

// 📌 Notificación a las 6:00 p.m.
cron.schedule('0 18 * * *', async () => {
  console.log('📢 Enviando notificación de "¿Cómo te fue hoy?"');

  const tokens = await User.getAllTokens();
  if (tokens.length > 0) {
    await sendNotification(tokens, 'LumiMood', '¿Cómo te fue hoy? ¿Quieres contar algo?');
  }
});

// 📌 Notificación a las 8:00 p.m. si el usuario no ha registrado emoción
cron.schedule('0 20 * * *', async () => {
  console.log('📢 Enviando recordatorio para registrar emociones');

  const tokens = await User.getAllTokens();
  for (const token of tokens) {
    const lastEmotion = await Emotion.getLastEmotion(token.user_id);
    const today = new Date().toISOString().split('T')[0];

    if (!lastEmotion || lastEmotion.created_at.split('T')[0] !== today) {
      await sendNotification([token], 'LumiMood', 'Hey, no has registrado cómo te sientes hoy. ¿Quieres hacerlo?');
    }
  }
});

console.log('📆 Notificaciones programadas');
