const Database = require('better-sqlite3');

const db = new Database('database.sqlite');

// Create users table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL
  )
`).run();

module.exports = db;
