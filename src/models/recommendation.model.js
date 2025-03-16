const db = require('../config/db');

class Recommendation {
  static async create(title, description) {
    const [result] = await db.execute(
      'INSERT INTO recommendations (title, description) VALUES (?, ?)',
      [title, description]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await db.execute(
      'SELECT id, title, description, created_at FROM recommendations ORDER BY created_at DESC'
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.execute(
      'SELECT id, title, description, created_at FROM recommendations WHERE id = ?',
      [id]
    );
    return rows[0];
  }
}

module.exports = Recommendation;
