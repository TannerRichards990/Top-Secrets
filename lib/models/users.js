const pool = require('../utils/pool');

module.exports = class User {
  id;
  firstName;
  lastName;
  email;
  passwordHash;

  constructor({ id, firstName, lastName, email, passwordHash }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.passwordHash = passwordHash;
  }

  static async insert({ firstName, lastName, email, passwordHash }) {
    const { rows } = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password_Hash) VALUES ($1, $2, $3, $4) RETURNING *',
      [firstName, lastName, email, passwordHash]
    );

    return new User(rows[0]);
  }

};
