const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const authenticate = require('../middleware/authenticate');

router.post('/', authenticate, notesController.createNote);
router.get('/', authenticate, notesController.getNotes);
router.get('/search', authenticate, notesController.searchNotes);
router.get('/archived', authenticate, notesController.getArchivedNotes);
router.get('/trash', authenticate, notesController.getTrashNotes);
router.get('/tag/:tag', authenticate, notesController.getNotesByTag);
router.get('/reminder', authenticate, notesController.getNotesByReminder);
router.put('/:id', authenticate, notesController.updateNote);
router.delete('/:id', authenticate, notesController.deleteNote);

module.exports = router;
