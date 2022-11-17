const pool = require('../utils/pool');

module.exports = class User {
  id;
  firstName;
  lastName;
  email;
  #passwordHash;

  constructor({ id, first_name, last_name, email, passwordHash }) {
    this.id = id;
    this.firstName = first_name;
    this.lastName = last_name;
    this.email = email;
    this.#passwordHash = passwordHash;
  }

  static async insert({ firstName, lastName, email, passwordHash }) {
    const { rows } = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
      [firstName, lastName, email, passwordHash]
    );


    return new User(rows[0]);
  }

  static async getByEmail(email) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email=$1',
      [email]
    );

    if (!rows[0]) return null;

    return new User(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM users');

    return rows.map(row => new User(row));
  }

  get passwordHash() {
    return this.#passwordHash;
  }

};
