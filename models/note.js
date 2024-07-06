const pool = require('../config/db');

const createNoteTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      title VARCHAR(30),
      content TEXT,
      tags VARCHAR(255)[],
      background_color VARCHAR(10) DEFAULT 'white',
      archived BOOLEAN DEFAULT FALSE,
      trash BOOLEAN DEFAULT FALSE,
      reminder TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;
  await pool.query(query);
};

module.exports = {
  createNoteTable,
}
