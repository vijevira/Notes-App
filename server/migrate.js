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


const runMigrations = async () => {
  await createDatabase();
  await createUserTable();
  await createNoteTable();
  await createSessionTable();
  console.log('Migrations completed.');
  process.exit(0);
};

runMigrations();
