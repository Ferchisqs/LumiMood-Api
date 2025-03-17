const db = require('../config/db');

class Message {
  static async create(userId, question) {
    // Inserta el mensaje en la base de datos
    const [result] = await db.execute(
      'INSERT INTO messages (user_id, question) VALUES (?, ?)',
      [userId, question]
    );
    
    const messageId = result.insertId;

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
