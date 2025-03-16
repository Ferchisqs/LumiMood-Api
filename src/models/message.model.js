const db = require('../config/db');
class Message {
  static async create(userId, question) {
    const [result] = await db.execute(
      'INSERT INTO messages (user_id, question) VALUES (?, ?)',
      [userId, question]
    );
    return result.insertId;
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

  // Nuevo método para obtener un mensaje por ID
  static async getById(messageId) {
    const [rows] = await db.execute(
      'SELECT id, user_id, question, response, created_at FROM messages WHERE id = ?',
      [messageId]
    );
    return rows[0]; // Devolver el primer resultado si existe
  }
}

module.exports = Message;
