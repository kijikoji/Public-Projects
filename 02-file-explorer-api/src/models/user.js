const db = require('../db');

function createUser(username, passwordHash) {
  const stmt = db.prepare("INSERT INTO users (username, passwordHash) VALUES (?, ?)");
  const info = stmt.run(username, passwordHash);
  return { id: info.lastInsertRowid, username };
}

function findUserByUsername(username) {
  return db.prepare("SELECT * FROM users WHERE username = ?").get(username);
}

function findUserById(id) {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
}

module.exports = { createUser, findUserByUsername, findUserById };
