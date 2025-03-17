const db = require('../config/db');
const { sendNotification } = require('../config/firebase'); 

class Message {
  static async create(userId, question) {
    // Inserta el mensaje en la base de datos
    const [result] = await db.execute(
      'INSERT INTO messages (user_id, question) VALUES (?, ?)',
      [userId, question]
    );
    
    const messageId = result.insertId;

    // Obtener los tokens FCM de todos los usuarios que tienen tokens registrados
    const [tokensResult] = await db.execute('SELECT fcmToken FROM users WHERE fcmToken IS NOT NULL');
    const tokens = tokensResult.map(row => row.fcmToken);

    if (tokens.length > 0) {
      // Enviar la pregunta (question) como notificación a todos los usuarios con FCM token
      const title = 'Nuevo mensaje recibido';
      const body = question; // Aquí el cuerpo del mensaje es la pregunta pasada
      
      try {
        // Cambiamos sendMulticast por sendToDevice
        await sendNotification(tokens, title, body);
        console.log('Notificaciones enviadas a todos los usuarios.');
      } catch (error) {
        console.error('Error enviando notificaciones:', error);
      }
    } else {
      console.log('No se encontraron tokens FCM para enviar notificaciones.');
    }

    return messageId; // Retorna el ID del mensaje creado
  }

  static async respond(messageId, response) {
    await db.execute('UPDATE messages SET response = ? WHERE id = ?', [response, messageId]);
  }

  static async getByUser(userId) {
    const [rows] = await db.execute(
      'SELECT id, question, response, created_at FROM messages WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }

  static async getById(messageId) {
    const [rows] = await db.execute(
      'SELECT id, user_id, question, response, created_at FROM messages WHERE id = ?',
      [messageId]
    );
    return rows[0]; 
  }
}

module.exports = Message;
