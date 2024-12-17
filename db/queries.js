import pool from './pool.js';

async function createCollection(collection) {
  await pool.query(
    `INSERT INTO collections (name, description)
    VALUES ($1, $2)`,
    [collection.name, collection.description]
  );
}

async function getCollections() {
  const { rows } = await pool.query('SELECT name FROM collections');
  return rows;
}

const db = { createCollection, getCollections };
export default db;
