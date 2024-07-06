exports.USER = {
  create: `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`,
  get: `SELECT * FROM users WHERE username = $1`
};
exports.NOTE = {
  create: `INSERT INTO notes (user_id, title, content, tags, background_color, reminder) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
  get: `SELECT * FROM notes WHERE user_id = $1 AND trash = FALSE AND archived = FALSE ORDER BY updated_at DESC`,
  update: `UPDATE notes SET FIELDSNAME, updated_at = NOW() WHERE id = ID RETURNING *`,
  delete: `DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *`,
  search: `SELECT * FROM notes WHERE user_id = $1 AND trash = FALSE AND (title ILIKE $2 OR content ILIKE $2 OR tags::text ILIKE $2)`,
  getArchived: `SELECT * FROM notes WHERE user_id = $1 AND archived = TRUE`,
  getTrash: `SELECT * FROM notes WHERE user_id = $1 AND trash = TRUE AND updated_at > NOW() - INTERVAL \'30 days\'`,
  getNotesByTag: `SELECT * FROM notes WHERE user_id = $1 AND EXISTS (SELECT 1 FROM unnest(tags) AS tag WHERE tag ILIKE $2)`,
  deleteTrash: `DELETE FROM notes WHERE user_id = $1 AND trash = true AND updated_at < NOW() - INTERVAL '30 days'`,
  getNotesByReminder: `SELECT * FROM notes WHERE user_id = $1 AND trash = FALSE AND archived = FALSE AND reminder IS NOT NULL ORDER BY reminder ASC`
};
