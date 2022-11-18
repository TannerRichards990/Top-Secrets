const pool = require('../utils/pool');

module.exports = class Secret {
  id;
  title;
  description;
  created_at;

  constructor({ id, title, description, created_at }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.created_at = created_at;
  }

  static async getAll() {
    const { rows } = await pool.query(`
      SELECT * FROM secrets`);
    return rows.map((row) => new Secret(row));
  }

  static async insert(secret) {
    const { rows } = await pool.query(`
      INSERT INTO secrets (title, description)
      VALUES ($1, $2)
      RETURNING *
    `, [secret.title, secret.description]);

    return new Secret(rows[0]);
  }
};




