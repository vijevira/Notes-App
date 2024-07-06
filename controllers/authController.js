const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const queries = require('../config/queries').USER;

const validateUsername = (username) => {
  if (!username) {
    return 'Username is required.';
  }
  if (typeof username !== 'string' || username.trim().length < 3 || username.trim().length > 15) {
    return 'Username must be between 3 and 15 characters long.';
  }
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return 'Username can only contain letters, numbers, and underscores.';
  }
  return null; // No errors
}

const validatePassword = (password) => {
  if (!password) {
    return 'Password is required.';
  }
  if (typeof password !== 'string' || password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /\W/.test(password);
  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChars) {
    return 'Password must include uppercase, lowercase, numbers, and special characters.';
  }
  return null; // No errors
}

const validateCredentials = (username, password) => {
  const usernameError = validateUsername(username);
  const passwordError = validatePassword(password);
  if (usernameError || passwordError) {
    return new Error(usernameError || passwordError);
  }
  return null; // No errors
}


const register = async (req, res) => {
  const { username, password } = req.body;
  const validationError = validateCredentials(username, password);
  if (validationError) {
    console.error('Invalid Credential', validationError);
    return res.status(400).json({ error: validationError.message });
   }
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = queries.create;
  const values = [username, hashedPassword];
  try {
    const result = await pool.query(query, values);
    console.debug(`New user registered: ${result}`);
    res.status(201).json(`User registered with username: ${username}`);
  } catch (error) {
    console.error('Error while registering user', error);
    res.status(400).json({ error: 'User already exists' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const validationError = validateUsername(username);
  if (validationError) {
    console.error('Invalid Credential', validationError);
    return res.status(400).json({ error: 'Invalid Credential' });
   }
  const query = queries.get;
  try {
    const result = await pool.query(query, [username]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'User not registered' });
    }
    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }
    // Store user data in session
    req.session.user = {
      id: user.id,
      username: user.username,
    };
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ error: 'Logout failed' });
    }
    res.status(200).send({ message: 'Logged out successfully' });
  });
}

module.exports = {
  register,
  login,
  logout
}