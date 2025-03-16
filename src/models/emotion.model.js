const db = require('../config/db');

class Emotion {
  static async create(userId, emotion, color) {
    const [result] = await db.execute(
      'INSERT INTO emotions (user_id, emotion, color) VALUES (?, ?, ?)',
      [userId, emotion, color]
    );
    return result.insertId;
  }

  static async getByUser(userId) {
    const [rows] = await db.execute(
      'SELECT id, emotion, color, created_at FROM emotions WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }

  static async getLastEmotion(userId) {
    const [rows] = await db.execute(
      'SELECT emotion, created_at FROM emotions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    return rows.length > 0 ? rows[0] : null;
  }
}

module.exports = Emotion;
