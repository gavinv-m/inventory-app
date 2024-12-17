import pool from './pool.js';

async function createCollection(collection) {
  await pool.query(
    `INSERT INTO collections (name, description)
    VALUES ($1, $2)`,
    [collection.name, collection.description]
  );
}

const db = { createCollection };
export default db;
