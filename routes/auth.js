const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// router.post('/', authController.loginOrRegister);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
