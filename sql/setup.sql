-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE
  IF EXISTS users;

DROP TABLE
  IF EXISTS secrets;

CREATE TABLE
  users (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL
  );

CREATE TABLE
  secrets (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP
    WITH
      TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

INSERT INTO
  secrets (title, description)
VALUES
  ('secret', 'little secret'),
  ('super secret', 'super little secret'),
  ('big secret', 'big little secret');