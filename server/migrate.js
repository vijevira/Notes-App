// const { Pool } = require('pg');
const { Client } = require('pg');

const databaseName = process.env.DB_NAME;
const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PWD,
  port: process.env.DB_PORT,
};
const { createUserTable } = require('../models/user');
const { createNoteTable } = require('../models/note');
const { createSessionTable } = require('../models/session');

const createDatabase = async () => {
  const client = new Client(config);
  await client.connect();
  try {
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${databaseName}'`);
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE ${databaseName}`);
      console.log(`Database '${databaseName}' created successfully.`);
    } else {
      console.log(`Database '${databaseName}' already exists.`);
    }
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await client.end();
  }
};

// const createTables = async () => {
//   const pool = new Pool({
//     database: databaseName,
//     ...config
//   });

//   const createUsersTableQuery = `
//     CREATE TABLE IF NOT EXISTS users (
//       id SERIAL PRIMARY KEY,
//       username VARCHAR(50) UNIQUE NOT NULL,
//       password VARCHAR(255) NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );
//   `;

//   const createNotesTableQuery = `
//     CREATE TABLE IF NOT EXISTS notes (
//       id SERIAL PRIMARY KEY,
//       user_id INTEGER NOT NULL,
//       title VARCHAR(255),
//       content TEXT,
//       tags VARCHAR(255)[],
//       background_color VARCHAR(50),
//       is_archived BOOLEAN DEFAULT FALSE,
//       is_trashed BOOLEAN DEFAULT FALSE,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       due_date TIMESTAMP,
//       FOREIGN KEY (user_id) REFERENCES users (id)
//     );
//   `;

//   try {
//     const client = await pool.connect();
//     await client.query(createUsersTableQuery);
//     console.log("Table 'users' created successfully.");

//     await client.query(createNotesTableQuery);
//     console.log("Table 'notes' created successfully.");
//   } catch (err) {
//     console.error('Error creating tables:', err);
//   } finally {
//     await pool.end();
//   }
// };

const runMigrations = async () => {
  await createDatabase();
  await createUserTable();
  await createNoteTable();
  await createSessionTable();
  console.log('Migrations completed.');
  process.exit(0);
};

runMigrations();
