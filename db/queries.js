import pool from './pool.js';
import fetchMovieById from '../controllers/fetch-movie-by-id.js';

// Queried by addMovie in add-movie-controller.js
async function addMovie(data) {
  try {
    const filmDetails = await fetchMovieById(data['database-id']);

    // Add to movies if not in DB
    const movieInDB = await pool.query(
      `SELECT id FROM movies WHERE database_id = $1`,
      [data['database-id']]
    );

    let movieID;
    if (movieInDB.rowCount < 1) {
      result = await pool.query(
        `INSERT INTO movies
      (database_id, title, poster_url, rating, country, year)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id`,
        [
          data['database-id'],
          filmDetails.title,
          filmDetails.posterURL,
          filmDetails.rating,
          filmDetails.country,
          filmDetails.year,
        ]
      );
      movieID = result.rows[0].id;
    } else {
      movieID = movieInDB.rows[0].id;
    }

    const collectionResult = await pool.query(
      `SELECT id FROM collections WHERE name = $1`,
      [data['select-collection']]
    );
    const collectionID = collectionResult.rows[0].id;

    await pool.query(
      `INSERT INTO movies_in_collection
    (collection_id, movie_id)
    VALUES ($1, $2)`,
      [collectionID, movieID]
    );
  } catch (error) {
    throw new Error('Error adding movie: Movie exists in collection');
  }
}

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

const db = { addMovie, createCollection, getCollections };
export default db;
