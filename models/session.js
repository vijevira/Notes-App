const pool = require('../config/db');

const createSessionTable = async () => {
  const query = `
  CREATE TABLE IF NOT EXISTS session (
    sid VARCHAR PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL
  );
  CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON session ("expire");
  `;
  await pool.query(query);
};

module.exports = {
  createSessionTable
}