const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('../routes/auth');
const notesRoutes = require('../routes/notes');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const path = require('path');
const pool = require('../config/db')

const app = express();
app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: 'session'
  }),
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000  // 1 day
  }
}));

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use(express.static(path.join(process.cwd(), '/public')));



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
