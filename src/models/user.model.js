const db = require('../config/db');

class User {
  static async create(name, email, hashedPassword, role = 'user', fcmToken) {
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, role, fcmToken) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role , fcmToken]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT id, name, email, role FROM users WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async getAllTokens() {
    const [rows] = await db.execute('SELECT fcm_token FROM users WHERE fcm_token IS NOT NULL');
    return rows.map(row => row.fcm_token);
  }
}

module.exports = User;
