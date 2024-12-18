import pkg from 'pg';
import client from './client.js';

const { Client } = pkg;

// prettier-ignore
const moviesTableQuery = `
CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    database_id INTEGER UNIQUE, 
    title VARCHAR(255) NOT NULL, 
    poster_url TEXT,
    rating DECIMAL(3, 1),
    country VARCHAR(100),
    year INTEGER
    );
`;

// prettier-ignore
const collectionsTableQuery = `
CREATE TABLE IF NOT EXISTS collections (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(140)
    );
`;

// Joint table
// prettier-ignore
const moviesCollectionsQuery = `
CREATE TABLE IF NOT EXISTS movies_in_collection (
    id SERIAL PRIMARY KEY,
    collection_id INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    UNIQUE(collection_id, movie_id)
    )
`;

const createDatabase = async () => {
  const inProduction = process.env.NODE_ENV === 'production';
  let currentClient = client;

  try {
    await currentClient.connect();

    // Create database if in development
    try {
      await currentClient.query('CREATE DATABASE my_movie_db');
      console.log('Database created successfully');
    } catch (error) {
      if (error.code === '42P04') {
        console.log('Database already exists');
      } else {
        throw error;
      }
    }

    // Disconnect from default db and connect to my_movie_db
    await currentClient.end();

    // Connect to new database
    currentClient = new Client({
      connectionString: inProduction
        ? process.env.DATABASE_URL
        : process.env.LOCAL_DB_URL + '/my_movie_db',
      ssl: inProduction ? { rejectUnauthorized: false } : false,
    });
    await currentClient.connect();

    console.log('Creating tables...');
    console.log('Creating movies table...');
    await currentClient.query(moviesTableQuery);

    console.log('Creating collections table...');
    await currentClient.query(collectionsTableQuery);

    console.log('Creating joint table...');
    await currentClient.query(moviesCollectionsQuery);

    console.log('Database setup completed');
  } catch (error) {
    console.error('Error during DB creation or population', err);
  } finally {
    await currentClient.end();
    console.log('done');
  }
};

createDatabase();
