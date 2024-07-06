const pool = require('../config/db');
const queries = require('../config/queries').NOTE;

exports.createNote = async (req, res) => {
  const { title, content, tags, background_color, reminder } = req.body;
  const userId = req.user.id;
  const query = queries.create;
  const values = [userId, title, content, tags, background_color, reminder || null];
  try {
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getNotes = async (req, res) => {
  const userId = req.user.id;
  const query = queries.get;
  try {
    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content, tags, background_color, archived, trash, reminder } = req.body;

  // Collect all the fields to be updated
  const fields = [];
  if (title !== undefined) fields.push(`title = '${title}'`);
  if (content !== undefined) fields.push(`content = '${content}'`);
  if (tags) fields.push(`tags = '{${tags.join(",")}}'`);
  if (background_color) fields.push(`background_color = '${background_color}'`);
  if (archived !== undefined) fields.push(`archived = ${archived}`);
  if (trash !== undefined) fields.push(`trash = ${trash}`);
  if (reminder) fields.push(`reminder = '${reminder}'`);

  if (fields.length === 0) {
    return res.status(400).send({ error: 'No fields to update' });
  }


  let updateQuery = queries.update;
  updateQuery = updateQuery.replace('FIELDSNAME', `${fields.join(', ')}`);
  updateQuery = updateQuery.replace('ID', id);
  try {
    const { rows } = await pool.query(updateQuery);
    if (rows.length === 0) {
      return res.status(404).send({ error: 'Note not found' });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Error updating note:', err);
    res.status(500).send({ error: 'Error updating note' });
  }
};

exports.deleteNote = async (req, res) => {
  const noteId = req.params.id;
  const query = queries.delete;
  try {
    const result = await pool.query(query, [noteId, req.user.id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.searchNotes = async (req, res) => {
  const userId = req.user.id;
  const { query } = req.query;
  const searchQuery = queries.search;
  try {
    const result = await pool.query(searchQuery, [userId, `%${query}%`]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getArchivedNotes = async (req, res) => {
  const userId = req.user.id;
  const query = queries.getArchived;
  try {
    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteTrash = async (userId) => {
  const query = queries.deleteTrash;
  try {
    const result = await pool.query(query, [userId]);
    if (result.length > 0) console.debug(`Trashed data deleted successfuly: ${result}`);
  } catch (error) {
    console.error(`Error while deleting trashed data older than 30 days: ${error}`);
  }
};

exports.getTrashNotes = async (req, res) => {
  const userId = req.user.id;
  const query = queries.getTrash;
  try {
    await deleteTrash(userId);
    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getNotesByTag = async (req, res) => {
  const userId = req.user.id;
  const { tag } = req.params;
  const query = queries.getNotesByTag;
  try {
    const result = await pool.query(query, [userId, tag]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getNotesByReminder = async (req, res) => {
  const query = queries.getNotesByReminder;
  const userId = req.user.id;
  const { tag } = req.params;
  try {
    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}
